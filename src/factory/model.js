oleo.factory("Model", function() {
  function Model(opts) {
    this._args = opts || {};
    this.options = {};
    this.set("id", this._args.id || this.uniqId());
    this.set("name", this._args.name || "");
    this.set("weight", this._args.order || 0);
    this.set("creationDate", this._args.creationDate || new Date());
  }
  Model.prototype.get = function(prop) {
    if (prop) {
      return this.options[prop] || null;
    } else {
      return Object.create(this.options);
    }
  };
  Model.prototype.set = function(prop, val) {
    this.options[prop] = val;
    return this;
  };
  Model.prototype.uniqId = function() {
    return Math.random().toString(36).substr(2, 6);
  };
  return Model;
});

