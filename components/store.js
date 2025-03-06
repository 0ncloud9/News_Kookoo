// 옵저버 패턴을 구현한 클래스
class Observer {
  constructor() {
    this.subscribers = [];
  }

  // 구독 추가
  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  // 구독 취소
  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  // 상태 변경시 모든 구독자에게 알림
  notify(data) {
    this.subscribers.forEach((subscriber) => subscriber(data));
  }
}

// 전역 상태 객체와 관리 메서드를 담은 스토어 생성
const createStore = (initialState) => {
  const observer = new Observer();

  // Proxy를 사용하여 상태 변경 감지
  const state = new Proxy(initialState, {
    set(target, property, value) {
      const oldValue = target[property];
      target[property] = value;

      // 값이 변경됐을 때만 알림
      if (oldValue !== value) {
        observer.notify({
          property,
          value,
          state: { ...target },
        });
      }
      return true;
    },
  });

  return {
    getState: () => ({ ...state }),
    setState: (property, value) => {
      state[property] = value;
    },
    subscribe: (callback) => {
      observer.subscribe(callback);
      return () => observer.unsubscribe(callback);
    },
  };
};

const initialState = {
  category: "all",
  page: 1,
  loading: false,
};

// 스토어 생성 및 내보내기
export const store = createStore(initialState);
export default store;
