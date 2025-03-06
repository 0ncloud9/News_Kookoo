import { store } from "./store.js";

export default function Nav() {
  const nav = document.createElement("nav");
  nav.classList.add("category-list");
  nav.innerHTML = `
    <ul>
      <li id="all" class="category-item active">전체보기</li>
      <li id="business" class="category-item">비즈니스</li>
      <li id="entertainment" class="category-item">엔터테인먼트</li>
      <li id="health" class="category-item">건강</li>
      <li id="science" class="category-item">과학</li>
      <li id="sports" class="category-item">스포츠</li>
      <li id="technology" class="category-item">기술</li>
    </ul>
  `;

  nav.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("category-item")) {
      const activeItem = nav.querySelector(".category-item.active");
      if (activeItem) {
        activeItem.classList.remove("active");
      }
      target.classList.add("active");

      const categoryId = target.id;
      store.setState("category", categoryId);

      store.setState("page", 1);
    }
  });

  return nav;
}
