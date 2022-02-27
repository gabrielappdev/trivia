export class LocalStorage {
  _persist(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  setData(key, json) {
    let currentData = this.getData(key);
    if (currentData) {
      currentData = { ...currentData, ...json };
    } else {
      currentData = { ...json };
    }
    this._persist(key, currentData);
  }
  getData(key) {
    const currentStoredData = localStorage.getItem(key);
    if (currentStoredData) {
      const object = JSON.parse(currentStoredData);
      return object;
    }
    return null;
  }
  removeData(key) {
    const currentStoredData = localStorage.getItem(key);
    if (currentStoredData) {
      localStorage.removeItem(key);
    }
  }
}
