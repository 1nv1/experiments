class kvdb {

  constructor(schema = '_') {

    // UUID generator
    this._uuid = function() {
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    };

    this.db = localStorage;
    this.schema = schema;
    this.is_new = false;
    let k = this.schema + '._id';
    let _id = this.db.getItem(k);
    if (_id === null) {
      _id = this._uuid();
      this.db.setItem(k, _id);
      this.is_new = true;
    };

  }

  _isJ(s) {
    try {
      JSON.parse(s);
    } catch (e) {
      return false;
    }
    return true;
  }

  isNew() {
    return this.is_new;
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

  get(key, dflt = null) {
    key = this.schema + "." + key;
    if ((this.db.hasOwnProperty(key) == false)) {
      return dflt;
    }

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
    var j, q;
    var len = this.schema.length;
    var arr = [];
    q = this.db.length;
    for (j = 0; j < q; j++){
      if (this.db.key(j).substring(0, len) == this.schema)
        arr.push(this.db.key(j));
    }
    q = arr.length;
    for (j = 0; j < q; j++) {
      this.db.removeItem(arr[j]);
    }
  }

  id() {
    let k = this.schema + '._id';
    return this.db.getItem(k);
  }

}
