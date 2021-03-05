class kvdb {

  constructor(schema = '') {
    this.db =localStorage;
    this.schema = schema;

    this._uuid =  function() {
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
      return uuid;
    };
    let k = this.schema + '._id';
    let _id = this.db.getItem(k);
    if (_id === null) {
      _id = this._uuid();
      this.db.setItem(k, _id);
    }
  }

  _isJ(s) {
    try {
      JSON.parse(s);
    } catch (e) {
      return false;
    }
    return true;
  }

  inc(key) {
    key = this.schema + "." + key;
    let v = this.db.getItem(key);
    if (v === null) {
      this.db.setItem(key, 1);
    } else {
      this.db.setItem(key, Number(v) + 1);
    }
  }

  get(key) {
    key = this.schema + "." + key;
    let value = this.db.getItem(key);
    if (typeof value == 'number') {
      return Number(value);
    }
    else if (this._isJ(value) === true) {
      return JSON.parse(value);
    }
    return value;
  }

  set(key, value) {
    key = this.schema + "." + key;
    if (typeof value == 'number') {
      this.db.setItem(key, value.toString());
    }
    else if (typeof value === 'object' && value !== null) {
      this.db.setItem(key, JSON.stringify(value));

    }
    else {
      this.db.setItem(key, value);
    }
  }

  del(key) {
    key = this.schema + "." + key;
    this.db.removeItem(key);
  }

  key(index) {
    key = this.schema + "." + key;
    return this.db.key(index);
  }

  drop() {
    this.db.clear();
  }

  id() {
    let k = this.schema + '._id';
    return this.db.getItem(k);
  }

}
