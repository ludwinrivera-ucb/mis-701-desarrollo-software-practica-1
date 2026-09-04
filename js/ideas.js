const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Cuaderno espiral 100 hojas Lider",
        category: "books",
        categoryLabel: "Cuadernos y Papelería",
        brand: "Líder",
        sku: "CUA-101",
        price: 42.0,
        stock: 25,
        min_stock: 5,
        description: "Cuaderno tamaño carta de 100 hojas cuadriculado.",
        date: "2026-08-24"
    },
    {
        id: 2,
        name: "Colores Faber-Castell 24 unidades",
        category: "pencils",
        categoryLabel: "Escritura y Colores",
        brand: "Faber-Castell",
        sku: "COL-204",
        price: 58.0,
        stock: 12,
        min_stock: 5,
        description: "Caja de lápices de colores largos ecológicos.",
        date: "2026-08-24"
    },
    {
        id: 3,
        name: "Hojas carta Artwork 500 unidades",
        category: "books",
        categoryLabel: "Cuadernos y Papelería",
        brand: "Artwork",
        sku: "PAP-301",
        price: 31.5,
        stock: 40,
        min_stock: 10,
        description: "Resma de papel bond tamaño carta 75g.",
        date: "2026-08-23"
    },
    {
        id: 4,
        name: "Diccionario escolar Sopena",
        category: "others",
        categoryLabel: "Otros útiles",
        brand: "Sopena",
        sku: "DIC-401",
        price: 75.0,
        stock: 3,
        min_stock: 5,
        description: "Diccionario de la lengua española para primaria y secundaria.",
        date: "2026-08-22"
    },
    {
        id: 5,
        name: "Juego de reglas geométricas y compás",
        category: "geometry",
        categoryLabel: "Reglas y Geometría",
        brand: "Maped",
        sku: "REG-502",
        price: 25.0,
        stock: 0,
        min_stock: 4,
        description: "Estuche escolar con regla de 30cm, escuadras, transportador y compás.",
        date: "2026-08-20"
    }
];

const INITIAL_SALES = [
    {
        id: 1,
        product: "Cuaderno Lider",
        quantity: 1,
        date: "24/08/2026",
        total: 42.0,
        status: "ok",
        statusLabel: "Pagado"
    },
    {
        id: 2,
        product: "Colores Faber Castell 24u",
        quantity: 2,
        date: "24/08/2026",
        total: 58.0,
        status: "warn",
        statusLabel: "En proceso"
    },
    {
        id: 3,
        product: "Hojas carta Artwork",
        quantity: 1,
        date: "23/08/2026",
        total: 31.5,
        status: "ok",
        statusLabel: "Pagado"
    },
    {
        id: 4,
        product: "Diccionario escolar Sopena",
        quantity: 1,
        date: "22/08/2026",
        total: 75.0,
        status: "danger",
        statusLabel: "Pendiente"
    }
];

const STORAGE_KEY = "ideas_libreria_productos";
const SALES_STORAGE_KEY = "ideas_libreria_ventas";

function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        return [...INITIAL_PRODUCTS];
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Error al parsear productos desde LocalStorage:", e);
        return [...INITIAL_PRODUCTS];
    }
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function addProduct(productData) {
    const products = getProducts();
    const newProduct = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        ...productData
    };

    products.unshift(newProduct);
    saveProducts(products);
    return newProduct;
}

function getStockStatusBadge(stock, minStock) {
    const parsedStock = Number(stock);
    const parsedMin = Number(minStock) || 5;

    if (parsedStock <= 0) {
        return '<span class="status danger">Agotado</span>';
    } else if (parsedStock <= parsedMin) {
        return '<span class="status warn">Stock bajo</span>';
    } else {
        return '<span class="status ok">Disponible</span>';
    }
}

function renderProductsTable() {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;

    const products = getProducts();
    tbody.innerHTML = "";

    if (products.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #6b7280; padding: 24px;">
          No hay productos registrados actualmente.
        </td>
      </tr>
    `;
        return;
    }

    products.forEach((prod) => {
        const row = document.createElement("tr");

        const formattedPrice = Number(prod.price).toFixed(2);
        const statusBadge = getStockStatusBadge(prod.stock, prod.min_stock);

        row.innerHTML = `
      <td><strong>${prod.name}</strong></td>
      <td>${prod.sku || "-"}</td>
      <td>${formattedPrice} Bs.</td>
      <td>${prod.categoryLabel || prod.category || "-"}</td>
      <td>${prod.brand || "-"}</td>
      <td>${prod.stock} u. ${statusBadge}</td>
    `;

        tbody.appendChild(row);
    });
}

function getSales() {
    const stored = localStorage.getItem(SALES_STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(INITIAL_SALES));
        return [...INITIAL_SALES];
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Error al parsear ventas desde LocalStorage:", e);
        return [...INITIAL_SALES];
    }
}

function saveSales(sales) {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
}

function addSale(saleData) {
    const sales = getSales();
    const newSale = {
        id: Date.now(),
        ...saleData
    };

    sales.unshift(newSale);
    saveSales(sales);
    return newSale;
}

function renderSalesTable(limit = null) {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;

    let sales = getSales();
    if (limit && typeof limit === "number") {
        sales = sales.slice(0, limit);
    }
    tbody.innerHTML = "";

    if (sales.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #6b7280; padding: 24px;">
          No hay ventas registradas actualmente.
        </td>
      </tr>
    `;
        return;
    }

    sales.forEach((sale) => {
        const row = document.createElement("tr");
        const formattedTotal = Number(sale.total).toFixed(2);

        let statusClass = "ok";
        if (sale.status === "warn" || sale.statusLabel === "En proceso") {
            statusClass = "warn";
        } else if (sale.status === "danger" || sale.statusLabel === "Pendiente") {
            statusClass = "danger";
        }

        row.innerHTML = `
      <td><strong>${sale.product}</strong></td>
      <td>${sale.quantity}</td>
      <td>${sale.date}</td>
      <td>${formattedTotal} Bs.</td>
      <td><span class="status ${statusClass}">${sale.statusLabel || "Pagado"}</span></td>
    `;

        tbody.appendChild(row);
    });
}

const CATEGORY_NAMES = {
    books: "Cuadernos y Papelería",
    pencils: "Escritura y Colores",
    paint: "Arte y Manualidades",
    geometry: "Reglas y Geometría",
    glues: "Pegamentos y Tijeras",
    bags: "Mochilas y Estuches",
    others: "Otros útiles"
};

function setupAddProductForm() {
    const form = document.querySelector(".form-add-product, .form-register form");
    if (!form || !form.elements['name'] || !form.elements['sku']) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = form.elements['name']?.value.trim();
        const category = form.elements['category']?.value;
        const brand = form.elements['brand']?.value.trim();
        const sku = form.elements['sku']?.value.trim();
        const price = parseFloat(form.elements['price']?.value) || 0;
        const stock = parseInt(form.elements['stock']?.value, 10) || 0;
        const min_stock = parseInt(form.elements['min_stock']?.value, 10) || 5;
        const description = form.elements['description']?.value.trim();

        if (!name) {
            alert("Por favor ingrese el nombre del producto.");
            return;
        }

        const newProduct = {
            name,
            category,
            categoryLabel: CATEGORY_NAMES[category] || category,
            brand,
            sku,
            price,
            stock,
            min_stock,
            description
        };

        addProduct(newProduct);

        window.location.href = "productos.html";
    });
}

function setupAddSaleForm() {
    const form = document.querySelector(".form-add-sale, .form-register form");
    if (!form || !form.elements['product'] || form.elements['sku']) return;

    const dateInput = form.elements['date'];
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split("T")[0];
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const product = form.elements['product']?.value.trim();
        const quantity = parseInt(form.elements['quantity']?.value, 10) || 1;
        const price = parseFloat(form.elements['price']?.value) || 0;
        const rawDate = form.elements['date']?.value;
        const status = form.elements['status']?.value || "ok";
        const customer = form.elements['customer']?.value?.trim() || "";
        const payment_method = form.elements['payment_method']?.value || "efectivo";
        const notes = form.elements['notes']?.value?.trim() || "";

        if (!product) {
            alert("Por favor ingrese el nombre del producto.");
            return;
        }

        let formattedDate = rawDate;
        if (rawDate && rawDate.includes("-")) {
            const [yyyy, mm, dd] = rawDate.split("-");
            formattedDate = `${dd}/${mm}/${yyyy}`;
        }

        const statusLabels = {
            ok: "Pagado",
            warn: "En proceso",
            danger: "Pendiente"
        };

        const total = quantity * price;

        const newSale = {
            product,
            quantity,
            date: formattedDate || new Date().toLocaleDateString("es-ES"),
            total,
            status,
            statusLabel: statusLabels[status] || "Pagado",
            customer,
            payment_method,
            notes
        };

        addSale(newSale);

        window.location.href = "ventas.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupAddProductForm();
    setupAddSaleForm();

    if (document.querySelector(".content-grid")) {
        renderSalesTable(5);
    } else if (document.querySelector("table tbody")) {
        const isVentas = document.title.toLowerCase().includes("ventas") || window.location.pathname.includes("ventas.html");
        if (isVentas) {
            renderSalesTable();
        } else {
            renderProductsTable();
        }
    }
});
