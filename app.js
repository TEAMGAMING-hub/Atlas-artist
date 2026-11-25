const SUPABASE_URL = window.ATLAS_CONFIG.supabaseUrl;
const SUPABASE_KEY = window.ATLAS_CONFIG.supabasePublishableKey;

const fallbackArtists = [
  { name:"Ninho", country:"France", genres:["Hip-hop","Trap","Pop urbaine"], active_from:"2013", image_url:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Ninho_2021.png/800px-Ninho_2021.png", biography:"William Nzobazola, connu sous le nom de Ninho, est un rappeur français né à Longjumeau en 1996. Il s’est imposé comme l’une des figures majeures du rap francophone.", official_url:"https://www.niofficiel.com/", wikipedia_url:"https://fr.wikipedia.org/wiki/Ninho", birth_place:"Longjumeau, Essonne" },
  { name:"L’Algerino", country:"France", genres:["Hip-hop","Rap","Raï"], active_from:"2001", image_url:"", biography:"Samir Djoghlal, connu sous le nom de L’Algerino, est un rappeur français d’origine algérienne né à Marseille en 1981.", official_url:"https://www.lalgerino.com/", wikipedia_url:"https://fr.wikipedia.org/wiki/L%27Alg%C3%A9rino", birth_place:"Marseille" },
  { name:"Eva", country:"France", genres:["Pop","R&B","Pop urbaine"], active_from:"2018", image_url:"", biography:"Eva Garnier est une chanteuse française née à Nice en 2001. Elle se fait connaître avec le single « Mood » puis avec son premier album.", official_url:"https://evaofficiel.fr/", wikipedia_url:"https://fr.wikipedia.org/wiki/Eva_(chanteuse)", birth_place:"Nice" },
  { name:"Jade LeMac", country:"Canada", genres:["Pop","Pop alternative"], active_from:"2020", image_url:"", biography:"Jade LeMac est une chanteuse canadienne originaire de Vancouver. Ses chansons mêlent pop alternative et textes introspectifs.", official_url:"https://jadelemac.com/", wikipedia_url:"https://en.wikipedia.org/wiki/Jade_LeMac", birth_place:"Vancouver" },
  { name:"Tate McRae", country:"Canada", genres:["Pop","Dance-pop","Pop alternative"], active_from:"2013", image_url:"", biography:"Tate Rosner McRae est une chanteuse, danseuse et auteure-compositrice canadienne née à Calgary en 2003. Elle connaît une notoriété internationale avec « you broke me first ».", official_url:"https://www.tatemcrae.com/", wikipedia_url:"https://en.wikipedia.org/wiki/Tate_McRae", birth_place:"Calgary, Alberta" }
];

const grid = document.querySelector("#grid");
const status = document.querySelector("#status");
const search = document.querySelector("#search");
const countrySelect = document.querySelector("#country");
let artists = [];

async function loadArtists() {
  let source = "local";
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/artists?select=*&order=name.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.length) { artists = data; source = "Supabase"; }
      else artists = fallbackArtists;
    } else artists = fallbackArtists;
  } catch (_) { artists = fallbackArtists; }

  status.textContent = `${artists.length} artistes — source : ${source}`;
  populateCountries();
  render();
}

function populateCountries() {
  [...new Set(artists.map(a => a.country).filter(Boolean))].sort().forEach(country => {
    const option = document.createElement("option"); option.value = country; option.textContent = country;
    countrySelect.append(option);
  });
}

function escapeHtml(value) {
  const element = document.createElement("div"); element.textContent = value ?? ""; return element.innerHTML;
}

function cardTemplate(artist) {
  const genres = Array.isArray(artist.genres) ? artist.genres : (artist.genre ? String(artist.genre).split(",") : []);
  const fallbackImage = `https://placehold.co/800x1000/e8e4d7/4a4a40?text=${encodeURIComponent(artist.name)}`;
  const image = artist.image_url || fallbackImage;
  return `<article class="card">
    <div class="cover"><img src="${escapeHtml(image)}" alt="Portrait de ${escapeHtml(artist.name)}" loading="lazy" /></div>
    <h2>${escapeHtml(artist.name)}</h2>
    <div class="meta"><span>${escapeHtml(artist.country || "Origine inconnue")}</span><span>Depuis ${escapeHtml(artist.active_from || artist.career_start || "—")}</span></div>
    <div class="tags">${genres.map(g => `<span class="tag">${escapeHtml(g.trim())}</span>`).join("")}</div>
    <div class="card-details">
      ${artist.birth_place ? `<p><strong>Origine :</strong> ${escapeHtml(artist.birth_place)}</p>` : ""}
      <p>${escapeHtml(artist.biography || "Informations en cours de vérification.")}</p>
      <div class="sources">
        ${artist.official_url ? `<a href="${escapeHtml(artist.official_url)}" target="_blank" rel="noopener noreferrer">Site officiel</a>` : ""}
        ${artist.wikipedia_url ? `<a href="${escapeHtml(artist.wikipedia_url)}" target="_blank" rel="noopener noreferrer">Wikipédia</a>` : ""}
      </div>
    </div>
  </article>`;
}

function render() {
  const term = search.value.trim().toLocaleLowerCase("fr");
  const country = countrySelect.value;
  const filtered = artists.filter(a => {
    const matchesText = `${a.name} ${a.country} ${a.birth_place || ""}`.toLocaleLowerCase("fr").includes(term);
    return matchesText && (!country || a.country === country);
  });
  grid.innerHTML = filtered.length ? filtered.map(cardTemplate).join("") : `<p class="empty">Aucun artiste ne correspond à cette recherche.</p>`;
}

search.addEventListener("input", render);
countrySelect.addEventListener("change", render);
loadArtists();
