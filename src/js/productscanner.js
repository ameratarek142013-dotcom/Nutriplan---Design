

const searchInput = document.getElementById("product-search-input")
const searchBtn = document.getElementById("search-product-btn")
const productContainer =  document.getElementById("products-grid")
const productsCount = document.getElementById("products-count")
const barcodeInput = document.getElementById("barcode-input")
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn")
const categoryContainer = document.getElementById("product-categories")

let currentProducts = []

 const icons = [
  "fa-cookie-bite",  
  "fa-glass-water",   
  "fa-cow",           
  "fa-cheese",        
  "fa-jar",          
  "fa-candy-cane",    
  "fa-cookie",       
  "fa-ice-cream",     
  "fa-bowl-food",
  "fa-seedling", 
  ]

  const colors = [
    { bg: "#fef9c3", text: "#854d0e", hover: "#fef08a" },   
    { bg: "#fce7f3", text: "#9d174d", hover: "#fbcfe8" },   
    { bg: "#ffedd5", text: "#9a3412", hover: "#fed7aa" },   
    { bg: "#f3f4f6", text: "#374151", hover: "#e5e7eb" },   
    { bg: "#fef3c7", text: "#92400e", hover: "#fde68a" },   
    { bg: "#fee2e2", text: "#991b1b", hover: "#fecaca" },   
    { bg: "#e0f2fe", text: "#075985", hover: "#bae6fd" },   
    { bg: "#ccfbf1", text: "#115e59", hover: "#99f6e4" },   
    { bg: "#dcfce7", text: "#166534", hover: "#bbf7d0" },   
    { bg: "#d1fae5", text: "#065f46", hover: "#a7f3d0" },  
]



searchBtn.addEventListener("click" , ()=> {
    let searchValue = searchInput.value.trim()
    if (!searchValue) return
    getProduct(searchValue)
})

lookupBarcodeBtn.addEventListener("click" , ()=>{
    let searchBarcodeValue = barcodeInput.value.trim()
    if (!searchBarcodeValue) return
    getProductBarcode(searchBarcodeValue)
})

async function getProduct(searchValue) {
    try {
        
        document.getElementById("loading")?.classList.remove("hidden")
        document.getElementById("noProduct")?.classList.add("hidden")

        const response = await fetch(`https://nutriplan-api.vercel.app/api/products/search?q=${searchValue}&page=1&limit=24`)
        const data = await response.json()
        const allsearchedProducts = data.results
         console.log("updated currentProducts:", currentProducts)
        currentProducts = allsearchedProducts 
        console.log(currentProducts)
        console.log(allsearchedProducts);

        if (!updateProductsState(allsearchedProducts , searchValue)) {
            return
        }

        displayProduct(allsearchedProducts)
    } catch (error) {
        console.error("search product failed", error);
    }
}


function updateProductsState(products ,input) {
  if (!products.length || !products[0]) {
    productContainer.innerHTML = `
      <div class="flex flex-col items-center text-center text-gray-400">
        <i class="fa-solid fa-box-open text-5xl mb-4 text-gray-300"></i>
        <p class="text-lg font-medium">No products to display</p>
        <p class="text-sm mt-1">Try a different search term or barcode</p>
      </div>
    `;

    productsCount.textContent = `No products found for "${input}"`;
    return false;
  }

  productsCount.textContent = `Found ${products.length} products for "${input}"`;
  return true;
}


function displayProduct(allsearchedProducts) {

  const products = allsearchedProducts
    .filter(product =>
      product.nutrients.calories &&
      product.nutrients.protein &&
      product.nutrients.carbs &&
      product.nutrients.fat &&
      product.nutrients.sugar
    );

  productContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 min-h-[400px] items-center">

      ${products.map(product => `
        <div
          class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          data-barcode="${product.barcode}"
        >
          <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            ${product.image? `<img
              class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            />` : `<i class="fa-solid fa-box text-5xl text-gray-300"></i>`}

            ${product.nutritionGrade !== "unknown" ? `
              <div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                Nutri-Score ${product.nutritionGrade}
              </div>
            ` : ""}

            ${product.novaGroup ? `
              <div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                ${product.novaGroup}
              </div>
            ` : ""}
          </div>

          <div class="p-4">
            <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
              ${product.brand.split(" ",1).join(" ")}
            </p>

            <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              ${product.name}
            </h3>

            <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span>
                <i class="fa-solid fa-fire mr-1"></i>
                ${Math.round(product.nutrients.calories)} kcal/100g
              </span>
            </div>

            <div class="grid grid-cols-4 gap-1 text-center">
              <div class="bg-emerald-50 rounded p-1.5">
                <p class="text-xs font-bold text-emerald-700">${product.nutrients.protein.toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Protein</p>
              </div>

              <div class="bg-blue-50 rounded p-1.5">
                <p class="text-xs font-bold text-blue-700">${product.nutrients.carbs.toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Carbs</p>
              </div>

              <div class="bg-purple-50 rounded p-1.5">
                <p class="text-xs font-bold text-purple-700">${product.nutrients.fat.toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Fat</p>
              </div>

              <div class="bg-orange-50 rounded p-1.5">
                <p class="text-xs font-bold text-orange-700">${product.nutrients.sugar.toFixed(1)}g</p>
                <p class="text-[10px] text-gray-500">Sugar</p>
              </div>
            </div>
          </div>
        </div>
      `).join("")}

    </div>
  `;
}


async function getProductBarcode(searchBarcodeValue) {
    try {
        document.getElementById("loading").classList.remove("hidden")
        document.getElementById("noProduct").classList.add("hidden")
        const response = await fetch(`https://nutriplan-api.vercel.app/api/products/barcode/${searchBarcodeValue}`)
         if (!response.ok) {
            updateProductsState([], searchBarcodeValue);
            return
        }
        const data = await response.json()
        const product = data.result
         currentProducts = [data.result] 
        console.log(product);

        
        if(!updateProductsState([product] , searchBarcodeValue)) return
        displayProduct([product])
        
    } catch (error) {
        console.log("barcode error");
        
    }
}


async function getCategories(){
    try {
        const response = await fetch(`https://nutriplan-api.vercel.app/api/products/categories`)
        const data = await response.json()
        const categories = data.results
        console.log(categories);
        displayCategories(categories)
    } catch (error) {
        console.log("catigories error");
        
    }
}
getCategories()

function displayCategories(categories) {
    document.getElementById("product-categories").innerHTML = categories.slice(0, 10).map((btn, index) => {
        const color = colors[index % colors.length]
        const icon = icons[index % icons.length]
        return `<button
            data-category="${btn.name}"
            class="product-category-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            style="background-color: ${color.bg}; color: ${color.text};"
            onmouseover="this.style.backgroundColor='${color.hover}'"
            onmouseout="this.style.backgroundColor='${color.bg}'"
        >
            <i class="fa-solid ${icon} mr-1.5"></i>${btn.name}
        </button>`
    }).join("")

    categoryContainer.addEventListener("click" , (e) =>{
        const btn = e.target.closest(".product-category-btn")
        if (!btn) return
        getProductsByCategory(btn.dataset.category)
    })
}

async function getProductsByCategory(categoryId) {
    try {
        document.getElementById("loading").classList.remove("hidden")
        document.getElementById("noProduct").classList.add("hidden")
        const response = await fetch(`https://nutriplan-api.vercel.app/api/products/category/${categoryId}`)
        const data = await response.json()
        const products = data.results
        currentProducts = products 
        console.log(products);
        
        if (!updateProductsState(products, categoryId)) return
        
        displayProduct(products)
    } catch (error) {
        console.log("category fetch failed")
    }
}




document.querySelectorAll(".nutri-score-filter").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".nutri-score-filter").forEach(b => {
            b.classList.remove("border-2" , "border-black" )
        })
        btn.classList.add("border-2" , "border-black")

        const grade = btn.dataset.grade

        
        if (!grade) {
            displayProduct(currentProducts)
            return
        }

        const filtered = currentProducts.filter(product =>
            product.nutritionGrade?.toLowerCase() === grade
        )

        if (filtered.length === 0) {
            productContainer.innerHTML = `
                <div class="flex flex-col items-center text-center text-gray-400">
                    <i class="fa-solid fa-box-open text-5xl mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium">No products with Nutri-Score ${grade.toUpperCase()}</p>
                </div>`
            return
        }

        displayProduct(filtered)
    })
})




productContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card")
    if (!card) return
    const barcode = card.dataset.barcode
    const product = currentProducts.find(p => p.barcode === barcode)
    if (product) showProductModal(product)
})

function getNutriScoreColor(grade) {
    const colors = { a: "#22c55e", b: "#84cc16", c: "#eab308", d: "#f97316", e: "#ef4444" }
    return colors[grade?.toLowerCase()] || "#9ca3af"
}

function getNutriLabel(grade) {
    const labels = { a: "Great", b: "Good", c: "Okay", d: "Poor", e: "Bad" }
    return labels[grade?.toLowerCase()] || ""
}

function getNovaColor(nova) {
    const colors = { 1: "#22c55e", 2: "#84cc16", 3: "#f97316", 4: "#ef4444" }
    return colors[String(nova)] || "#9ca3af"
}

function getNovaLabel(nova) {
    const labels = { 1: "Unprocessed", 2: "Processed ingredient", 3: "Processed", 4: "Ultra-processed" }
    return labels[String(nova)] || ""
}

function showProductModal(product) {
    document.getElementById("product-modal")?.remove()
    const n = product.nutrients

    const modal = document.createElement("div")
    modal.id = "product-modal"
    modal.style.cssText = "position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; padding:16px;"
    modal.innerHTML = `
    <div id="product-modal-backdrop" style="position:absolute; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(0.5px);"></div>
    <div style="position:relative; background:white; border-radius:20px; box-shadow:0 25px 50px rgba(0,0,0,0.2); width:700px; max-height:90vh; overflow-y:auto; z-index:10; padding :20px;">

        <!-- Header -->
        <div style="display:flex; align-items:flex-start; gap:16px; padding-block : 10px; ">
            <div style="width:150px; height:130px; border-radius:12px; background:#f9fafb; border:1px solid #f3f4f6; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden;">
                ${product.image
                    ? `<img src="${product.image}" style="width:100%; height:100%; object-fit:cover;">`
                    : `<i class="fa-solid fa-box" style="font-size:28px; color:#d1d5db;"></i>`}
            </div>
            <div style="flex:1; min-width:0; padding-top:4px;">
                <p style="font-size:16px; color:#10b981; font-weight:700; margin-bottom:4px;">${product.brand || ""}</p>
                <h3 style="font-size:24px; font-weight:800; color:#111827; line-height:1.3; margin-bottom:4px;">${product.name}</h3>
                ${product.quantity ? `<p style="font-size:13px; color:#9ca3af;">${product.quantity}</p>` : ""}
            </div>
            <button id="close-product-modal" style="width:32px; height:32px; border-radius:8px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:18px; flex-shrink:0;">✕</button>
        </div>

        <!-- Badges -->
        <div style="display:flex; gap:8px; padding:0 24px 16px;  ">
            ${product.nutritionGrade && product.nutritionGrade !== "unknown" ? `
            <div style="display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:12px; background:${getNutriScoreColor(product.nutritionGrade)}20; border:1.5px solid ${getNutriScoreColor(product.nutritionGrade)};">
                <div style="width:28px; height:28px; border-radius:8px; background:${getNutriScoreColor(product.nutritionGrade)}; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:13px;">${product.nutritionGrade.toUpperCase()}</div>
                <div>
                    <p style="font-size:12px; font-weight:700; color:${getNutriScoreColor(product.nutritionGrade)}; margin:0;">Nutri-Score</p>
                    <p style="font-size:10px; color:${getNutriScoreColor(product.nutritionGrade)}; opacity:0.8; margin:0;">${getNutriLabel(product.nutritionGrade)}</p>
                </div>
            </div>` : ""}
            ${product.novaGroup ? `
            <div style="display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:12px; background:${getNovaColor(product.novaGroup)}20; border:1.5px solid ${getNovaColor(product.novaGroup)};">
                <div style="width:28px; height:28px; border-radius:50%; background:${getNovaColor(product.novaGroup)}; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:13px;">${product.novaGroup}</div>
                <div>
                    <p style="font-size:12px; font-weight:700; color:${getNovaColor(product.novaGroup)}; margin:0;">NOVA</p>
                    <p style="font-size:10px; color:${getNovaColor(product.novaGroup)}; opacity:0.8; margin:0;">${getNovaLabel(product.novaGroup)}</p>
                </div>
            </div>` : ""}
        </div>

        <!-- Nutrition Facts -->
        <div style="margin:0 16px 16px; background:linear-gradient(135deg, #ecfdf5, #f0fdfa); border-radius:16px; padding:20px; border:1px solid #a7fcd0;">
            <div style="display:flex; align-items:center;  ">
                <i class="fa-solid fa-chart-pie" style="color:#10b981;"></i>
                <span style="font-weight:700; color:#111827;">Nutrition Facts</span>
                <span style="font-size:12px; color:#6b7280; margin-left:auto;">(per 100g)</span>
            </div>

            <!-- Calories -->
            <div style="text-align:center; margin-bottom:20px; border-bottom:1px solid #a7fcd0; padding-block : 20px;">
                <p style="font-size:52px; font-weight:800; color:#111827; margin:0;">${Math.round(n.calories)}</p>
                <p style="font-size:13px; color:#6b7280; margin:4px 0 0;">Calories</p>
            </div>
<!-- Macro Bars -->
<div style="border-bottom:1px solid #a7fcd0; padding-bottom:16px; margin-bottom:16px;">
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:12px; text-align:center;">
        ${[
            { label: "Protein", value: n.protein, color: "#10b981", textColor: "#059669", max: 100 },
            { label: "Carbs",   value: n.carbs,   color: "#3b82f6", textColor: "#2563eb", max: 300 },
            { label: "Fat",     value: n.fat,     color: "#a855f7", textColor: "#9333ea", max: 100 },
            { label: "Sugar",   value: n.sugar,   color: "#f97316", textColor: "#ea580c", max: 100 },
        ].map(m => `
        <div>
            <div style="width:100%; background:#E5E7EB; border-radius:999px; height:8px; margin-bottom:8px; margin-inline : 10px;">
                <div style="width:${Math.min(100, (m.value / m.max) * 100)}%; background:${m.color}; height:8px; border-radius:999px;"></div>
            </div>
            <p style="font-size:16px; font-weight:700; color:${m.textColor}; margin:0;">${parseFloat(m.value).toFixed(1)}g</p>
            <p style="font-size:11px; color:#6b7280; margin:2px 0 0;">${m.label}</p>
        </div>`).join("")}
    </div>
</div>

            <!-- Extra -->
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; text-align:center; gap:8px;">
                <div>
                    <p style="font-size:14px; font-weight:700; color:#374151; margin:0;">${parseFloat(n.saturatedFat || 0).toFixed(1)}g</p>
                    <p style="font-size:10px; color:#6b7280; margin:2px 0 0;">Saturated Fat</p>
                </div>
                <div>
                    <p style="font-size:14px; font-weight:700; color:#374151; margin:0;">${parseFloat(n.fiber || 0).toFixed(1)}g</p>
                    <p style="font-size:10px; color:#6b7280; margin:2px 0 0;">Fiber</p>
                </div>
                <div>
                    <p style="font-size:14px; font-weight:700; color:#374151; margin:0;">${parseFloat(n.salt || 0).toFixed(2)}g</p>
                    <p style="font-size:10px; color:#6b7280; margin:2px 0 0;">Salt</p>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div style="display:flex; gap:12px; padding:0 16px 24px;">
            <button id="modal-log-food-btn" style="flex:1; padding:14px; border-radius:12px; background:#10b981; color:white; font-weight:700; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-size:15px;">
                <i class="fa-solid fa-plus"></i> Log This Food
            </button>
            <button id="close-product-modal-btn" style="flex:1; padding:14px; border-radius:12px; background:#f3f4f6; color:#374151; font-weight:700; border:none; cursor:pointer; font-size:15px;">
                Close
            </button>
        </div>
    </div>`

    document.body.appendChild(modal)

    function closeModal() { modal.remove() }

    document.getElementById("close-product-modal").addEventListener("click", closeModal)
    document.getElementById("close-product-modal-btn").addEventListener("click", closeModal)
    document.getElementById("product-modal-backdrop").addEventListener("click", closeModal)

    document.getElementById("modal-log-food-btn").addEventListener("click", () => {
        import("./foodlog.js").then(({ logMeal }) => {
            logMeal({
                id: `product_${product.barcode}`,
                name: product.name,
                image: product.image || null,
                calories: Math.round(n.calories),
                protein: Math.round(n.protein),
                carbs: Math.round(n.carbs),
                fat: Math.round(n.fat),
                servings: 1,
            })
            closeModal()
            Toastify({
                text: `${product.name} logged to your daily intake! 📝`,
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #10b981, #0d9488)",
                    borderRadius: "12px",
                    fontWeight: "600",
                    padding: "12px 20px"
                }
            }).showToast()
        })
    })
}