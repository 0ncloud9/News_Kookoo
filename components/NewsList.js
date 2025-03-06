import { store } from "./store.js";

const API_KEY = "44d1f7d75abf4dd58567b52a86184ac9";
const limit = 5;

// getCategory 함수를 NewsList 함수 외부로 이동
function getCategory(category) {
  if (category === "all") return "";
  return `&category=${category}`;
}

async function getNews() {
  try {
    const state = store.getState();
    const { category, page } = state;

    const categoryQuery = getCategory(category);
    const baseUrl =
      category === "all"
        ? `https://newsapi.org/v2/everything?q=news`
        : `https://newsapi.org/v2/top-headlines?&category=${category}`;

    const url = `${baseUrl}&pageSize=${limit}&page=${page}&apiKey=${API_KEY}`;
    const response = await axios.get(url);

    return response.data.articles;
  } catch (err) {
    console.error("Error Loading News:", err);
    return [];
  }
}

export default function NewsList() {
  // 컨테이너 생성
  const newsListContainer = document.createElement("div");
  newsListContainer.classList.add("news-list-container");

  // 뉴스 리스트 영역 생성
  const newsList = document.createElement("article");
  newsList.classList.add("news-list");
  newsListContainer.appendChild(newsList);

  // 로딩 생성
  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("loading-indicator");
  loadingIndicator.innerHTML = `
        <div class="spinner">
            <img src="img/ball-triangle.svg" alt="Loading..." />
        </div>
    `;
  loadingIndicator.style.justifyContent = "center";
  loadingIndicator.style.display = "none";
  newsListContainer.appendChild(loadingIndicator);

  // 뉴스 박스 생성 함수
  function createNewsBox(article) {
    const { url, urlToImage, title, description } = article;

    const newsItem = document.createElement("section");
    newsItem.classList.add("news-item");

    newsItem.innerHTML = `
            <div class="thumbnail">
                <a href="${url}" target="_blank" rel="noopener noreferrer">
                    <img src="${
                      urlToImage ||
                      "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                    }" alt="thumbnail" />
                </a>
            </div>
            <div class="contents">
                <h2>
                    <a href="${url}" target="_blank" rel="noopener noreferrer">
                        ${title}
                    </a>
                </h2>
                <p>${description || ""}</p>
            </div>
        `;
    return newsItem;
  }

  // 뉴스 표시
  async function displayNews(shouldClear = false) {
    try {
      store.setState("loading", true);
      loadingIndicator.style.display = "flex";

      if (shouldClear) newsList.innerHTML = ``;

      const articles = await getNews();

      if (articles && articles.length > 0) {
        articles.forEach((article) => {
          const newsBox = createNewsBox(article);
          newsList.appendChild(newsBox);
        });
      } else {
        observer.unobserve(sentinel);
        sentinel.innerHTML = "더 이상 뉴스가 없습니다.";
      }
    } catch (err) {
      console.error("Error displaying news:", err);
      newsList.innerHTML +=
        '<div class="error-news">뉴스 로딩 중 오류가 발생했습니다.</div>';
    } finally {
      setTimeout(() => {
        loadingIndicator.style.display = "none";
        store.setState("loading", false);
      }, 1000);
    }
  }

  // 인터섹션 옵저버 콜백 함수
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !store.getState().loading) {
        const currentPage = store.getState().page;
        store.setState("page", currentPage + 1);
        displayNews(false);
      }
    });
  };

  // 인터섹션 옵저버 옵션
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const sentinel = document.createElement("div");
  sentinel.classList.add("sentinel");
  newsListContainer.appendChild(sentinel);

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(sentinel);

  const unsubscribe = store.subscribe(({ property, value }) => {
    if (property === "category") displayNews(true);
  });

  // 초기 뉴스 로드
  displayNews();

  return newsListContainer;
}
