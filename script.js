// ===== DATA MANAGEMENT =====
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.clients = this.loadClients();
    }

    loadProducts() {
        const saved = localStorage.getItem('mh_products');
        return saved ? JSON.parse(saved) : [];
    }

    loadClients() {
        const saved = localStorage.getItem('mh_clients');
        return saved ? JSON.parse(saved) : [];
    }

    saveProducts() {
        localStorage.setItem('mh_products', JSON.stringify(this.products));
    }

    saveClients() {
        localStorage.setItem('mh_clients', JSON.stringify(this.clients));
    }

    addProduct(data) {
        const product = {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString()
        };
        this.products.unshift(product);
        this.saveProducts();
        return product;
    }

    deleteProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveProducts();
    }

    updateProduct(id, data) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...data };
            this.saveProducts();
        }
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    searchProducts(query) {
        const q = query.toLowerCase();
        return this.products.filter(p =>
            p.productName.toLowerCase().includes(q) ||
            p.productNumber.toLowerCase().includes(q)
        );
    }

    searchClients(query) {
        const q = query.toLowerCase();
        return this.clients.filter(c =>
            c.clientName.toLowerCase().includes(q) ||
            c.clientEmail.toLowerCase().includes(q)
        );
    }

    getTotalValue() {
        return this.products.reduce((sum, p) => sum + (p.productPrice * p.productQuantity), 0);
    }

    getTotalQuantity() {
        return this.products.reduce((sum, p) => sum + p.productQuantity, 0);
    }

    getUniquClients() {
        const clientEmails = new Set();
        this.products.forEach(p => {
            if (p.clientEmail) clientEmails.add(p.clientEmail);
        });
        return clientEmails.size;
    }
}

// ===== INITIALIZE =====
const manager = new ProductManager();
let currentSearchQuery = '';
let currentClientSearchQuery = '';

// ===== DOM ELEMENTS =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const productForm = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');
const clientsContainer = document.getElementById('clientsContainer');
const searchInput = document.getElementById('searchInput');
const clientSearchInput = document.getElementById('clientSearchInput');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

// ===== TAB NAVIGATION =====
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Update dashboard
        if (tabName === 'dashboard') {
            updateDashboard();
        }
    });
});

// ===== FORM SUBMISSION =====
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        productName: document.getElementById('productName').value,
        productNumber: document.getElementById('productNumber').value,
        productDesc: document.getElementById('productDesc').value,
        productPrice: parseFloat(document.getElementById('productPrice').value),
        productQuantity: parseInt(document.getElementById('productQuantity').value),
        productCategory: document.getElementById('productCategory').value,
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        clientAddress: document.getElementById('clientAddress').value,
        clientCity: document.getElementById('clientCity').value,
        clientCountry: document.getElementById('clientCountry').value,
        paymentMode: document.getElementById('paymentMode').value,
        invoiceNumber: document.getElementById('invoiceNumber').value || `INV-${Date.now()}`,
        transactionDate: document.getElementById('transactionDate').value || new Date().toISOString().split('T')[0],
        orderStatus: document.getElementById('orderStatus').value
    };

    manager.addProduct(formData);
    productForm.reset();
    
    // Show success message
    showNotification('✅ Produit ajouté avec succès !', 'success');
    
    // Update UI
    updateDashboard();
    renderProducts();
    renderClients();
});

// ===== SEARCH =====
searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    renderProducts();
});

clientSearchInput.addEventListener('input', (e) => {
    currentClientSearchQuery = e.target.value;
    renderClients();
});

// ===== RENDER PRODUCTS =====
function renderProducts() {
    const productsToShow = currentSearchQuery
        ? manager.searchProducts(currentSearchQuery)
        : manager.products;

    if (productsToShow.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <span style="font-size: 3rem;">📭</span>
                <p>${currentSearchQuery ? 'Aucun produit trouvé.' : 'Aucun produit. Commencez par en ajouter un !'}</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${getCategoryEmoji(product.productCategory)}
            </div>
            <div class="product-info">
                <div class="product-name">${product.productName}</div>
                <div class="product-number">🏷️ ${product.productNumber}</div>
                <div class="product-price">${product.productPrice.toFixed(2)}€</div>
                <div class="product-quantity">📦 ${product.productQuantity} en stock</div>
                <div class="product-actions">
                    <button class="btn-small btn-view" onclick="showProductDetails(${product.id})">👁️ Voir</button>
                    <button class="btn-small btn-edit" onclick="editProduct(${product.id})">✏️ Éditer</button>
                    <button class="btn-small btn-delete" onclick="deleteProductConfirm(${product.id})">🗑️ Supprimer</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== RENDER CLIENTS =====
function renderClients() {
    const allClients = [];
    const seenEmails = new Set();

    manager.products.forEach(product => {
        if (product.clientEmail && !seenEmails.has(product.clientEmail)) {
            seenEmails.add(product.clientEmail);
            allClients.push(product);
        }
    });

    const clientsToShow = currentClientSearchQuery
        ? allClients.filter(p =>
            p.clientName.toLowerCase().includes(currentClientSearchQuery.toLowerCase()) ||
            p.clientEmail.toLowerCase().includes(currentClientSearchQuery.toLowerCase())
        )
        : allClients;

    if (clientsToShow.length === 0) {
        clientsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <span style="font-size: 3rem;">👤</span>
                <p>${currentClientSearchQuery ? 'Aucun client trouvé.' : 'Aucun client enregistré.'}</p>
            </div>
        `;
        return;
    }

    clientsContainer.innerHTML = clientsToShow.map(client => `
        <div class="client-card">
            <div class="client-avatar">${getInitials(client.clientName)}</div>
            <div class="client-name">${client.clientName || 'N/A'}</div>
            <div class="client-info">📧 ${client.clientEmail || 'N/A'}</div>
            <div class="client-info">📱 ${client.clientPhone || 'N/A'}</div>
            <div class="client-info">🌍 ${client.clientCity || 'N/A'}, ${client.clientCountry || 'N/A'}</div>
            <div class="client-info">💳 ${client.paymentMode || 'N/A'}</div>
            <button class="btn-small btn-view" onclick="showClientDetails('${client.clientEmail}')" style="margin-top: 15px;">Voir Détails</button>
        </div>
    `).join('');
}

// ===== DASHBOARD UPDATE =====
function updateDashboard() {
    const totalProducts = manager.products.length;
    const totalValue = manager.getTotalValue();
    const totalQuantity = manager.getTotalQuantity();
    const uniqueClients = manager.getUniquClients();

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = totalValue.toFixed(2) + '€';
    document.getElementById('dashSales').textContent = totalValue.toFixed(2) + '€';
    document.getElementById('dashInventory').textContent = totalQuantity + ' articles';
    document.getElementById('dashClients').textContent = uniqueClients;

    // Recent products
    const recentList = document.getElementById('recentList');
    const recent = manager.products.slice(0, 5);
    if (recent.length === 0) {
        recentList.innerHTML = '<p style="color: #999;">Aucun produit récent</p>';
    } else {
        recentList.innerHTML = recent.map(p => `
            <div class="recent-item">
                🆕 ${p.productName} - ${p.productPrice.toFixed(2)}€
            </div>
        `).join('');
    }
}

// ===== PRODUCT DETAILS MODAL =====
function showProductDetails(id) {
    const product = manager.getProductById(id);
    if (!product) return;

    modalBody.innerHTML = `
        <h3 style="margin-bottom: 20px; color: var(--primary-color);">📦 Détails du Produit</h3>
        
        <h4 style="margin-top: 20px; margin-bottom: 15px; color: var(--text-secondary);">Informations du Produit</h4>
        ${createDetailItem('Nom', product.productName)}
        ${createDetailItem('Numéro', product.productNumber)}
        ${createDetailItem('Catégorie', product.productCategory)}
        ${createDetailItem('Description', product.productDesc)}
        ${createDetailItem('Prix', product.productPrice.toFixed(2) + '€')}
        ${createDetailItem('Quantité', product.productQuantity + ' unités')}

        <h4 style="margin-top: 20px; margin-bottom: 15px; color: var(--text-secondary);">Informations Client</h4>
        ${createDetailItem('Nom', product.clientName)}
        ${createDetailItem('Email', product.clientEmail)}
        ${createDetailItem('Téléphone', product.clientPhone)}
        ${createDetailItem('Adresse', product.clientAddress)}
        ${createDetailItem('Ville', product.clientCity)}
        ${createDetailItem('Pays', product.clientCountry)}

        <h4 style="margin-top: 20px; margin-bottom: 15px; color: var(--text-secondary);">Informations de Paiement</h4>
        ${createDetailItem('Mode de Paiement', product.paymentMode)}
        ${createDetailItem('Numéro de Facture', product.invoiceNumber)}
        ${createDetailItem('Date', product.transactionDate)}
        ${createDetailItem('Statut', product.orderStatus)}
        
        <div style="margin-top: 30px; display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="editProduct(${id})">✏️ Éditer</button>
            <button class="btn btn-secondary" onclick="closeModal()">❌ Fermer</button>
        </div>
    `;
    modal.classList.add('show');
}

// ===== CLIENT DETAILS MODAL =====
function showClientDetails(email) {
    const clientProducts = manager.products.filter(p => p.clientEmail === email);
    if (clientProducts.length === 0) return;

    const client = clientProducts[0];
    const totalSpent = clientProducts.reduce((sum, p) => sum + (p.productPrice * p.productQuantity), 0);

    modalBody.innerHTML = `
        <h3 style="margin-bottom: 20px; color: var(--primary-color);">👥 Détails du Client</h3>
        
        ${createDetailItem('Nom', client.clientName)}
        ${createDetailItem('Email', client.clientEmail)}
        ${createDetailItem('Téléphone', client.clientPhone)}
        ${createDetailItem('Adresse', client.clientAddress)}
        ${createDetailItem('Ville', client.clientCity)}
        ${createDetailItem('Pays', client.clientCountry)}
        ${createDetailItem('Mode de Paiement', client.paymentMode)}
        
        <h4 style="margin-top: 20px; margin-bottom: 15px; color: var(--text-secondary);">📊 Statistiques</h4>
        ${createDetailItem('Total Commandes', clientProducts.length)}
        ${createDetailItem('Total Dépensé', totalSpent.toFixed(2) + '€')}
        
        <h4 style="margin-top: 20px; margin-bottom: 15px; color: var(--text-secondary);">📦 Produits Commandés</h4>
        ${clientProducts.map((p, i) => `
            <div style="background: rgba(102, 126, 234, 0.1); padding: 10px; margin: 5px 0; border-radius: 6px;">
                ${i + 1}. ${p.productName} (${p.productQuantity}x) - ${(p.productPrice * p.productQuantity).toFixed(2)}€
            </div>
        `).join('')}
        
        <div style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="closeModal()">❌ Fermer</button>
        </div>
    `;
    modal.classList.add('show');
}

// ===== CREATE DETAIL ITEM =====
function createDetailItem(label, value) {
    return `
        <div class="modal-detail">
            <div class="modal-label">${label}</div>
            <div class="modal-value">${value || 'N/A'}</div>
        </div>
    `;
}

// ===== EDIT PRODUCT =====
function editProduct(id) {
    const product = manager.getProductById(id);
    if (!product) return;

    document.getElementById('productName').value = product.productName;
    document.getElementById('productNumber').value = product.productNumber;
    document.getElementById('productDesc').value = product.productDesc;
    document.getElementById('productPrice').value = product.productPrice;
    document.getElementById('productQuantity').value = product.productQuantity;
    document.getElementById('productCategory').value = product.productCategory;
    document.getElementById('clientName').value = product.clientName;
    document.getElementById('clientEmail').value = product.clientEmail;
    document.getElementById('clientPhone').value = product.clientPhone;
    document.getElementById('clientAddress').value = product.clientAddress;
    document.getElementById('clientCity').value = product.clientCity;
    document.getElementById('clientCountry').value = product.clientCountry;
    document.getElementById('paymentMode').value = product.paymentMode;
    document.getElementById('invoiceNumber').value = product.invoiceNumber;
    document.getElementById('transactionDate').value = product.transactionDate;
    document.getElementById('orderStatus').value = product.orderStatus;

    closeModal();

    // Switch to add tab
    document.querySelectorAll('.tab-btn')[2].click();

    // Update form to edit mode
    productForm.dataset.editId = id;
    productForm.querySelector('button[type="submit"]').textContent = '💾 Mettre à jour le Produit';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== UPDATE PRODUCT ON FORM SUBMIT =====
productForm.addEventListener('submit', (e) => {
    if (productForm.dataset.editId) {
        e.preventDefault();
        
        const formData = {
            productName: document.getElementById('productName').value,
            productNumber: document.getElementById('productNumber').value,
            productDesc: document.getElementById('productDesc').value,
            productPrice: parseFloat(document.getElementById('productPrice').value),
            productQuantity: parseInt(document.getElementById('productQuantity').value),
            productCategory: document.getElementById('productCategory').value,
            clientName: document.getElementById('clientName').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientPhone: document.getElementById('clientPhone').value,
            clientAddress: document.getElementById('clientAddress').value,
            clientCity: document.getElementById('clientCity').value,
            clientCountry: document.getElementById('clientCountry').value,
            paymentMode: document.getElementById('paymentMode').value,
            invoiceNumber: document.getElementById('invoiceNumber').value,
            transactionDate: document.getElementById('transactionDate').value,
            orderStatus: document.getElementById('orderStatus').value
        };

        manager.updateProduct(parseInt(productForm.dataset.editId), formData);
        
        productForm.reset();
        delete productForm.dataset.editId;
        productForm.querySelector('button[type="submit"]').textContent = '➕ Ajouter le Produit';
        
        showNotification('✅ Produit mis à jour avec succès !', 'success');
        
        updateDashboard();
        renderProducts();
        renderClients();
    }
}, true);

// ===== DELETE PRODUCT =====
function deleteProductConfirm(id) {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.')) {
        manager.deleteProduct(id);
        showNotification('🗑️ Produit supprimé avec succès !', 'danger');
        updateDashboard();
        renderProducts();
        renderClients();
    }
}

// ===== MODAL ACTIONS =====
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('show');
    modalBody.innerHTML = '';
}

// ===== UTILITY FUNCTIONS =====
function getCategoryEmoji(category) {
    const emojis = {
        'Vêtements': '👕',
        'Électronique': '📱',
        'Accessoires': '👜',
        'Décoration': '🎨',
        'Autre': '📦'
    };
    return emojis[category] || '📦';
}

function getInitials(name) {
    if (!name) return '👤';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    
    if (type === 'danger') {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00d4ff, #0099cc)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== SET TODAY'S DATE =====
document.getElementById('transactionDate').valueAsDate = new Date();

// ===== INITIALIZE =====
updateDashboard();
renderProducts();
renderClients();
