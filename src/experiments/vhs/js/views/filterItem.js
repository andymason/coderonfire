var app = app || {};

app.FilterItemView = Backbone.View.extend({

  tagName: 'div',
  className: 'filter',

  events: {
    'click': 'toggleView',
    'click .remove':    'destroy',
    'change .input':     'update',
    'click .move_up':   'moveUp',
    'click .move_down': 'moveDown',
    'drop': 'drop'
  },


  initialize: function (options) {
    const tempField = `
    <label class="filter_input">
    <span class="option_name"><%= option.name %></span>

    <% if (option.type === 'select') { %>
        <select class="input" name="<%= option.name %>" type="select">
        <% _.each(option.options, function(selOpt, i) { %>
          <option value="<%= selOpt.value %>"><%= selOpt.name %></option>
        <% }); %>
        </select>
    <% } else { %>
      <input class="input input-<%= option.type %>"
      <% _.each(option, function(value, key) { %>
        <%= key %>="<%= value %>"
        <% if (value === true) { %> checked <% } %>
        <% }); %>
      >
    <% } %>
  </label>
  `;
  
    const tempInput = `
    <p class="filter_name"><%= name %></p>
    <div class="inputs_wrapper"></div>
    <button class="remove" title="Remove filter"> &#10060;</button>
    `;

    this.template = _.template(tempInput);
    this.inputTemplate = _.template(tempField);

    this.model.on('reset', this.destroy, this);
  },

  destroy: function() {
    console.log('model view destory');
    app.FilterCollection.remove(this.model);
    this.remove();
  },

  drop: function(event, index) {
    this.$el.trigger('update-sort', [this.model, index]);
  },

  moveUp: function() {
    this.model.moveUp();
  },

  moveDown: function() {
    this.model.moveDown();
  },

  toggleView: function() {
    $('.filter').toggleClass('closed', true);
    this.$el.toggleClass('closed', false);
  },

  update: _.debounce(function(event) {
    var $input = $(event.target);
    var optionIndex = this.model.get('options').map(function(e) {
        return e.name;
      }).indexOf($input.attr('name'));


    var op = {};
    var modelOption = 'options.' + optionIndex + '.value';

    var value;
    if ($input.attr('type') === 'checkbox') {
      value = !!$input.prop('checked');
    }

    if ($input.attr('type') === 'range') {
      value = parseFloat($input.val());
    }

    if ($input.attr('type') === 'select') {
      var tmpVal = $input.val();
      value = (isNaN(tmpVal)) ? tmpVal : parseInt(tmpVal, 10);
    }

    if ($input.attr('type') === 'color' || $input.attr('type') === 'text') {
      value = $input.val();
    }

    op[modelOption] = value;
    this.model.set(op);
    this.model.collection.trigger('update');
  }, 300),

  addInput: function(option) {
    var $view = $(this.inputTemplate({ option: option }));
    this.$inputWrapper.append($view);
    this.toggleView();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$inputWrapper = this.$('.inputs_wrapper');
    this.$el.addClass('closed');
    _.each(this.model.get('options'), this.addInput, this);

    return this;
  }

});
