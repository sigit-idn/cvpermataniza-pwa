window.addEventListener('load', event => navigator.serviceWorker?.register('service-worker.js'))

setTimeout(() => divInstall.classList.remove('hidden'), 10000)

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('👍', 'beforeinstallprompt', event);
  window.deferredPrompt = event;
  divInstall.classList.toggle('hidden', false);
});

butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    return;
  }
  promptEvent.prompt();
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  window.deferredPrompt = null;
  divInstall.classList.toggle('hidden', true);
});

window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  window.deferredPrompt = null;
  divInstall.classList.add('hidden');
});

const selectedOption = document.getElementById("kategori");
const searchInput = document.querySelector("#search-form input");
let firstData = 0;
let isDetail = true;
const switchDetail = (button) => {
  const popup = button.parentNode.parentNode.parentNode;
  popup.classList.toggle("detail");
  isDetail = !isDetail;
  button.innerHTML = isDetail
  ? "<i class='fas fa-info-circle'></i> Detail"
  : "<i class='fas fa-backspace'></i> Kembali";
  document
  .querySelectorAll(".detail-content, .desc, table")
  .forEach(
    (content) => (content.style.display = !isDetail ? "block" : "none")
    );
  };
  
  const setFilter = async (dataStart, filterOption, searchValue) => {
    document.getElementById('loading').style.display = 'block'
    let katalogHTML = '';
    filterOption = filterOption || selectedOption.value;
    firstData = firstData + dataStart;
    firstData = dataStart === 0 ? 0 : firstData;
    searchValue = searchValue || '';
    const formatPrice = price => {
      const priceArray = [...String(price)]
      priceArray.splice(priceArray.length - 3, 0, '.')
      return priceArray.join('')
    }

    document.querySelector("#katalog").innerHTML = "";
    
    const result = await fetch(`https://script.google.com/macros/s/AKfycbxd6zuhGf92N9orJ3Mzqwm_zCoqcLXlmUdDnQaONODKo0FgLM-frUt8R4tHcwT843XRaw/exec?first=${firstData}&search=${searchValue}&category=${filterOption}`) 
      .then(res => res.json()).then(data => data)
      
      result.data.forEach(book => {
        
        const { ID, Kategori, Nama, Harga, Deskripsi } = book;
        let category = Kategori.toLowerCase().replaceAll(" ", "-");
        
        if (Kategori === "Siswa / Siswa") category = "btu-siswa";
        else if (Kategori === "Siswa / Peminatan / Peminatan")
        category = "buku-perpustakaan";
        else if (
          (Kategori === "Guru / Wajib / Wajib") |
          (Kategori === "Guru / Guru")
          )
          category = "btu-guru";
          
          katalogHTML += `
          <div class="card">
          <img src="${
            book.imgSrc ||
            "https://a.cdn-myedisi.com/book/cover/bse-a_5d808681308ac150991970.jpg"
          }" alt="${Kategori}">
          <div>
          <div>
          <p>${Nama}</p>
          <small>Rp ${formatPrice(Harga)},00</small>
          <p class="detail-content" style="display: ${
            !isDetail ? "block" : "none"
          }">${Deskripsi.replaceAll("\n", "<span style='display : block'></span>")}</p>
          <table class="detail-content" style="display: ${
            !isDetail ? "block" : "none"
          }">
          <tr><th width="180">Harga Zona 1</th><td>Rp ${formatPrice(book["Harga Zona 1"])},00</td></tr>
          <tr><th>Harga Zona 2</th><td>Rp ${formatPrice(book["Harga Zona 2"])},00</td></tr>
          <tr><th>Harga Zona 3</th><td>Rp ${formatPrice(book["Harga Zona 3"])},00</td></tr>
          <tr><th>Harga Zona 4</th><td>Rp ${formatPrice(book["Harga Zona 4"])},00</td></tr>
          <tr><th>Harga Zona 5</th><td>Rp ${formatPrice(book["Harga Zona 5"])},00</td></tr>
          </table>
          </div>
          <div>
          <a onclick ="switchDetail(this)"><i class="fas fa-info-circle"></i> Detail</a>
          <a target="_blank" href="https://siplah.blanja.com/product/${category}/${ID}-${Nama.toLowerCase()
          .replaceAll(" - ", "-")
          .replaceAll(" ", "-")
          .replaceAll(",", "-")
          .replaceAll(":", "-")
          .replaceAll("/", "-")}"><i class="fas fa-cart-plus"></i> Beli</a>
          </div>
          </div>
          </div>
          `;
          document.querySelector(".halaman a").style.display = result.current_page <= 1 ? "none" : "initial"
          document.querySelector(".halaman a:last-child").style.display = result.current_page >= result.page_length ? "none" : "initial"
          document.querySelector(".halaman span").innerHTML = `　${result.current_page} / ${result.page_length}　`;
        })

        document.getElementById('loading').style.display = 'none'

        document.querySelector("#katalog").innerHTML = katalogHTML;
        document.querySelectorAll("#katalog *").forEach(katalogItem => katalogItem.style.transform = 'scale(0)')
        
        document
        .querySelectorAll(".desc, br, table, #katalog .hidden")
        .forEach((desc) => (desc.style.display = !isDetail ? "block" : "none"));
        // alert('percobaan kedua puluh tiga')

      document.querySelectorAll("#katalog *").forEach((katalogItem, i) => setTimeout(() => {
        katalogItem.style.transform = 'scale(1)'
      }, 2 * i))
};

setFilter(0, selectedOption.value);

window.addEventListener("scroll", () => {
  const more = document.querySelector(".more");

  more.style.opacity = `${2 - more.getBoundingClientRect().top / 200}`;
});

document.querySelectorAll("section").forEach((section, i) => {
  const elements = section.querySelectorAll("*:not(.overlay)");

  document.addEventListener("scroll", () =>
    scrollY >= section.getBoundingClientRect().top * 0.8
      ? elements.forEach((element, elementIndex) =>
          setTimeout(
            () => element.classList.remove("fadeup"),
            20 * elementIndex
          )
        )
      : elements.forEach((element) => element.classList.add("fadeup"))
  );
});

document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  setFilter(
    0,
    '',
    searchInput.value
  );
});

document.querySelectorAll('.nav-menu a').forEach(menu=> menu.addEventListener("click", event => document.getElementById(event.target.innerText.toLowerCase()).scrollIntoView({behavior:'smooth'})))