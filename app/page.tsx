'use client';

import { useEffect, useState, ReactNode } from 'react';

interface Product {
    id: number;
    productName: string;
    productNumber: string;
    productDesc: string;
    productPrice: number;
    productQuantity: number;
    productCategory: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    clientCity: string;
    clientCountry: string;
    paymentMode: string;
    invoiceNumber: string;
    transactionDate: string;
    orderStatus: string;
    createdAt: string;
}

interface ProductCardProps {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
}

interface ClientCardProps {
    client: Product;
}

interface ProductDetailsProps {
    product: Product;
}

interface DetailItemProps {
    label: string;
    value: string | number | undefined;
}

interface ProductFormProps {
    onSubmit: (formData: Partial<Product>) => void;
    initialData?: Product;
    isEditing: boolean;
    onCancel: () => void;
}

type FormData = Partial<Product> & {
    productName: string;
    productNumber: string;
    productDesc: string;
    productPrice: string | number;
    productQuantity: string | number;
    productCategory: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    clientCity: string;
    clientCountry: string;
    paymentMode: string;
    invoiceNumber: string;
    transactionDate: string;
    orderStatus: string;
};

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<any>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Load products from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('mh_products');
        if (saved) {
            setProducts(JSON.parse(saved));
        }
    }, []);

    // Save products to localStorage
    const saveProducts = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem('mh_products', JSON.stringify(newProducts));
    };

    const handleAddProduct = (formData: any) => {
        if (editingId) {
            const updated = products.map(p => p.id === editingId ? { ...p, ...formData } : p);
            saveProducts(updated);
            setEditingId(null);
        } else {
            const newProduct = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString(),
            };
            saveProducts([newProduct, ...products]);
        }
    };

    const handleDeleteProduct = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            saveProducts(products.filter(p => p.id !== id));
        }
    };

    const getTotalValue = () => products.reduce((sum, p) => sum + (p.productPrice * p.productQuantity), 0);
    const getTotalQuantity = () => products.reduce((sum, p) => sum + p.productQuantity, 0);
    const getUniqueClients = () => new Set(products.filter(p => p.clientEmail).map(p => p.clientEmail)).size;

    const filteredProducts = searchQuery
        ? products.filter(p =>
            p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.productNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

    const uniqueClients = [...new Map(
        products
            .filter(p => p.clientEmail)
            .map(p => [p.clientEmail, p])
    ).values()];

    const filteredClients = clientSearchQuery
        ? uniqueClients.filter(p =>
            p.clientName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
            p.clientEmail.toLowerCase().includes(clientSearchQuery.toLowerCase())
        )
        : uniqueClients;

    return (
        <div className="container">
            {/* HEADER */}
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-icon">🎯</span>
                        <div>
                            <h1>MH</h1>
                            <p>Gestion Premium de Produits</p>
                        </div>
                    </div>
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-number">{products.length}</span>
                            <span className="stat-label">Produits</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{getTotalValue().toFixed(0)}€</span>
                            <span className="stat-label">Valeur</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* TAB NAVIGATION */}
            <nav className="tab-navigation">
                <button
                    className={`tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('dashboard')}
                >
                    📊 Tableau de Bord
                </button>
                <button
                    className={`tab-btn ${currentTab === 'products' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('products')}
                >
                    📦 Produits
                </button>
                <button
                    className={`tab-btn ${currentTab === 'add' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('add')}
                >
                    ➕ Ajouter Produit
                </button>
                <button
                    className={`tab-btn ${currentTab === 'clients' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('clients')}
                >
                    👥 Clients
                </button>
            </nav>

            {/* DASHBOARD TAB */}
            {currentTab === 'dashboard' && (
                <section className="tab-content active">
                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>💰 Ventes Totales</h3>
                                <span className="refresh-icon">🔄</span>
                            </div>
                            <p className="card-value">{getTotalValue().toFixed(2)}€</p>
                            <div className="card-chart"></div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>📦 Inventaire</h3>
                                <span className="refresh-icon">🔄</span>
                            </div>
                            <p className="card-value">{getTotalQuantity()} articles</p>
                            <div className="card-chart"></div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>👥 Clients Actifs</h3>
                                <span className="refresh-icon">🔄</span>
                            </div>
                            <p className="card-value">{getUniqueClients()}</p>
                            <div className="card-chart"></div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header">
                                <h3>⏱️ Derniers Ajouts</h3>
                                <span className="refresh-icon">🔄</span>
                            </div>
                            <div className="recent-list">
                                {products.slice(0, 5).length === 0 ? (
                                    <p style={{ color: '#999' }}>Aucun produit récent</p>
                                ) : (
                                    products.slice(0, 5).map((p, i) => (
                                        <div key={i} className="recent-item">
                                            🆕 {p.productName} - {p.productPrice.toFixed(2)}€
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* PRODUCTS TAB */}
            {currentTab === 'products' && (
                <section className="tab-content active">
                    <div className="products-header">
                        <h2>📦 Liste des Produits</h2>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="🔍 Rechercher un produit..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="products-container">
                        {filteredProducts.length === 0 ? (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <span style={{ fontSize: '3rem' }}>📭</span>
                                <p>{searchQuery ? 'Aucun produit trouvé.' : 'Aucun produit. Commencez par en ajouter un !'}</p>
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={() => {
                                        setEditingId(product.id);
                                        setCurrentTab('add');
                                    }}
                                    onDelete={() => handleDeleteProduct(product.id)}
                                    onView={() => {
                                        setModalContent(product);
                                        setShowModal(true);
                                    }}
                                />
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* ADD PRODUCT TAB */}
            {currentTab === 'add' && (
                <section className="tab-content active">
                    <ProductForm
                        onSubmit={handleAddProduct}
                        initialData={editingId ? products.find(p => p.id === editingId) : undefined}
                        isEditing={!!editingId}
                        onCancel={() => setEditingId(null)}
                    />
                </section>
            )}

            {/* CLIENTS TAB */}
            {currentTab === 'clients' && (
                <section className="tab-content active">
                    <div className="clients-header">
                        <h2>👥 Gestion des Clients</h2>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="🔍 Rechercher un client..."
                                value={clientSearchQuery}
                                onChange={(e) => setClientSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="clients-container">
                        {filteredClients.length === 0 ? (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <span style={{ fontSize: '3rem' }}>👤</span>
                                <p>{clientSearchQuery ? 'Aucun client trouvé.' : 'Aucun client enregistré.'}</p>
                            </div>
                        ) : (
                            filteredClients.map(client => (
                                <ClientCard key={client.id} client={client} />
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* MODAL */}
            {showModal && modalContent && (
                <div className="modal show" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <ProductDetails product={modalContent} />
                    </div>
                </div>
            )}
        </div>
    );
}

function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps): ReactNode {
    const getCategoryEmoji = (category: string): string => {
        const emojis: Record<string, string> = {
            'Vêtements': '👕',
            'Électronique': '📱',
            'Accessoires': '👜',
            'Décoration': '🎨',
            'Autre': '📦'
        };
        return emojis[category] || '📦';
    };

    return (
        <div className="product-card">
            <div className="product-image">{getCategoryEmoji(product.productCategory)}</div>
            <div className="product-info">
                <div className="product-name">{product.productName}</div>
                <div className="product-number">🏷️ {product.productNumber}</div>
                <div className="product-price">{product.productPrice.toFixed(2)}€</div>
                <div className="product-quantity">📦 {product.productQuantity} en stock</div>
                <div className="product-actions">
                    <button className="btn-small btn-view" onClick={onView}>👁️ Voir</button>
                    <button className="btn-small btn-edit" onClick={onEdit}>✏️ Éditer</button>
                    <button className="btn-small btn-delete" onClick={onDelete}>🗑️ Supprimer</button>
                </div>
            </div>
        </div>
    );
}

function ClientCard({ client }: ClientCardProps): ReactNode {
    const getInitials = (name: string): string => {
        if (!name) return '👤';
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="client-card">
            <div className="client-avatar">{getInitials(client.clientName)}</div>
            <div className="client-name">{client.clientName || 'N/A'}</div>
            <div className="client-info">📧 {client.clientEmail || 'N/A'}</div>
            <div className="client-info">📱 {client.clientPhone || 'N/A'}</div>
            <div className="client-info">🌍 {client.clientCity || 'N/A'}, {client.clientCountry || 'N/A'}</div>
            <div className="client-info">💳 {client.paymentMode || 'N/A'}</div>
        </div>
    );
}

function ProductDetails({ product }: ProductDetailsProps): ReactNode {
    return (
        <div>
            <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>📦 Détails du Produit</h3>
            <h4 style={{ marginTop: '20px', marginBottom: '15px', color: 'var(--text-secondary)' }}>Informations du Produit</h4>
            <DetailItem label="Nom" value={product.productName} />
            <DetailItem label="Numéro" value={product.productNumber} />
            <DetailItem label="Catégorie" value={product.productCategory} />
            <DetailItem label="Description" value={product.productDesc} />
            <DetailItem label="Prix" value={product.productPrice.toFixed(2) + '€'} />
            <DetailItem label="Quantité" value={product.productQuantity + ' unités'} />

            <h4 style={{ marginTop: '20px', marginBottom: '15px', color: 'var(--text-secondary)' }}>Informations Client</h4>
            <DetailItem label="Nom" value={product.clientName} />
            <DetailItem label="Email" value={product.clientEmail} />
            <DetailItem label="Téléphone" value={product.clientPhone} />
            <DetailItem label="Adresse" value={product.clientAddress} />
            <DetailItem label="Ville" value={product.clientCity} />
            <DetailItem label="Pays" value={product.clientCountry} />

            <h4 style={{ marginTop: '20px', marginBottom: '15px', color: 'var(--text-secondary)' }}>Informations de Paiement</h4>
            <DetailItem label="Mode de Paiement" value={product.paymentMode} />
            <DetailItem label="Numéro de Facture" value={product.invoiceNumber} />
            <DetailItem label="Date" value={product.transactionDate} />
            <DetailItem label="Statut" value={product.orderStatus} />
        </div>
    );
}

function DetailItem({ label, value }: DetailItemProps): ReactNode {
    return (
        <div className="modal-detail">
            <div className="modal-label">{label}</div>
            <div className="modal-value">{value || 'N/A'}</div>
        </div>
    );
}

function ProductForm({ onSubmit, initialData, isEditing, onCancel }: ProductFormProps): ReactNode {
    const defaultFormData: FormData = {
        productName: '',
        productNumber: '',
        productDesc: '',
        productPrice: '',
        productQuantity: '',
        productCategory: 'Vêtements',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        clientCity: '',
        clientCountry: '',
        paymentMode: '',
        invoiceNumber: '',
        transactionDate: new Date().toISOString().split('T')[0],
        orderStatus: 'Pending',
    };

    const [formData, setFormData] = useState<FormData>(initialData || defaultFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(defaultFormData);
    };
            paymentMode: '',
            invoiceNumber: '',
            transactionDate: new Date().toISOString().split('T')[0],
            orderStatus: 'Pending',
        });
    };

    return (
        <div className="form-container">
            <h2>➕ Ajouter un Nouveau Produit</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Product Info */}
                    <div className="form-section">
                        <h3>📋 Informations du Produit</h3>
                        <div className="form-group">
                            <label htmlFor="productName">Nom du Produit *</label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                placeholder="Ex: T-Shirt Premium"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productNumber">Numéro de Produit *</label>
                            <input
                                type="text"
                                id="productNumber"
                                name="productNumber"
                                value={formData.productNumber}
                                onChange={handleChange}
                                required
                                placeholder="Ex: MH-001-2024"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productDesc">Description</label>
                            <textarea
                                id="productDesc"
                                name="productDesc"
                                value={formData.productDesc}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Décrivez votre produit en détail..."
                            ></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label htmlFor="productPrice">Prix (€) *</label>
                                <input
                                    type="number"
                                    id="productPrice"
                                    name="productPrice"
                                    value={formData.productPrice}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group flex-1">
                                <label htmlFor="productQuantity">Quantité *</label>
                                <input
                                    type="number"
                                    id="productQuantity"
                                    name="productQuantity"
                                    value={formData.productQuantity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="10"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="productCategory">Catégorie</label>
                            <select
                                id="productCategory"
                                name="productCategory"
                                value={formData.productCategory}
                                onChange={handleChange}
                            >
                                <option value="Vêtements">Vêtements</option>
                                <option value="Électronique">Électronique</option>
                                <option value="Accessoires">Accessoires</option>
                                <option value="Décoration">Décoration</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="form-section">
                        <h3>👥 Informations Client</h3>
                        <div className="form-group">
                            <label htmlFor="clientName">Nom du Client</label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                placeholder="Ex: Jean Dupont"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientEmail">Email</label>
                            <input
                                type="email"
                                id="clientEmail"
                                name="clientEmail"
                                value={formData.clientEmail}
                                onChange={handleChange}
                                placeholder="exemple@email.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientPhone">Téléphone</label>
                            <input
                                type="tel"
                                id="clientPhone"
                                name="clientPhone"
                                value={formData.clientPhone}
                                onChange={handleChange}
                                placeholder="+33 6 XX XX XX XX"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientAddress">Adresse</label>
                            <input
                                type="text"
                                id="clientAddress"
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleChange}
                                placeholder="123 Rue de la Paix"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label htmlFor="clientCity">Ville</label>
                                <input
                                    type="text"
                                    id="clientCity"
                                    name="clientCity"
                                    value={formData.clientCity}
                                    onChange={handleChange}
                                    placeholder="Paris"
                                />
                            </div>
                            <div className="form-group flex-1">
                                <label htmlFor="clientCountry">Pays</label>
                                <input
                                    type="text"
                                    id="clientCountry"
                                    name="clientCountry"
                                    value={formData.clientCountry}
                                    onChange={handleChange}
                                    placeholder="France"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="form-section">
                        <h3>💳 Informations de Paiement</h3>
                        <div className="form-group">
                            <label htmlFor="paymentMode">Mode de Paiement *</label>
                            <select
                                id="paymentMode"
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner un mode</option>
                                <option value="Carte Bancaire">Carte Bancaire</option>
                                <option value="Virement">Virement Bancaire</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Espèces">Espèces</option>
                                <option value="Chèque">Chèque</option>
                                <option value="Crypto-monnaie">Crypto-monnaie</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="invoiceNumber">Numéro de Facture</label>
                            <input
                                type="text"
                                id="invoiceNumber"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                placeholder="Auto-généré"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="transactionDate">Date de Transaction</label>
                            <input
                                type="date"
                                id="transactionDate"
                                name="transactionDate"
                                value={formData.transactionDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="orderStatus">Statut de la Commande</label>
                            <select
                                id="orderStatus"
                                name="orderStatus"
                                value={formData.orderStatus}
                                onChange={handleChange}
                            >
                                <option value="Pending">En Attente</option>
                                <option value="Processing">En Cours</option>
                                <option value="Shipped">Expédié</option>
                                <option value="Delivered">Livré</option>
                                <option value="Completed">Complété</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    {isEditing && (
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            setFormData({
                                productName: '',
                                productNumber: '',
                                productDesc: '',
                                productPrice: '',
                                productQuantity: '',
                                productCategory: 'Vêtements',
                                clientName: '',
                                clientEmail: '',
                                clientPhone: '',
                                clientAddress: '',
                                clientCity: '',
                                clientCountry: '',
                                paymentMode: '',
                                invoiceNumber: '',
                                transactionDate: new Date().toISOString().split('T')[0],
                                orderStatus: 'Pending',
                            });
                            onCancel();
                        }}>
                            ❌ Annuler
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? '💾 Mettre à jour' : '➕ Ajouter le Produit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
