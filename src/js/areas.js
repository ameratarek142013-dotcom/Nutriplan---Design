export async function getAreas() {
    const response = await fetch(`https://nutriplan-api.vercel.app/api/meals/areas`)
    const data = await response.json()
    const areas = data.results
    console.log(areas);
    displayAreas(areas)
}
function displayAreas(areas){
document.getElementById("areaBtns").innerHTML += areas.slice(0,10).map((area) => {
    return `
            <button
            data-area="${area.name}"
              class="area-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
            >
              ${area.name}
            </button>`
}).join(" ")
}