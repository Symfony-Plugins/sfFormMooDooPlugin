/*
 Script: sfMooWin_class.js
 autor: Damian Suarez
 email: damian.suarez@xifox.net
 Contiene las clases <mooWin>
 Class: mooWin
  Clase para crear ventanas utilizando codigo HTML, CSS y JS
  Note:
  mooWin requiere un doctype XHTML.
  License:
  Licencia MIT-style.
 */


window.addEvent ('domready', function () {
  var $arrElChoicesWithAdd = $$('.select_with_add');
  $arrElChoicesWithAdd.each (function ($elChoice, $iE) {
    var objChoice = new sfWidgetFromPropelWithAdd ($elChoice);
  })

});


var sfWidgetFromPropelWithAdd = new Class({
  Implements: [Events, Options],
  options: {

  },

  initialize: function(el, options){
    this.setOptions(options);
    this.initConf(el);
    this.addEvents2Buttons();

    // Ajax Conex
    this.createAjaxConex();
  },

  // Configuracion Inicial
  initConf: function(el){
    this.element = $(el);
    this.win2Add = this.element.getChildren('div.win_add2select')[0];
    this.win_error = this.element.getChildren('div.error_response')[0];

    this.input_select = this.element.getChildren('select')[0];

    this.btn_add = this.element.getChildren('div.btn_add')[0];
    this.btn_ok = this.win2Add.getChildren('div.icn_ok')[0];
    this.btn_cancel = this.win2Add.getChildren('div.icn_cancel')[0];


    this.input2Add = this.win2Add.getElement ('input');
    this.link2Add = this.input2Add.get('link_to_add');
  },

  addEvents2Buttons: function () {
    this.btn_add.addEvent ('click', function () {
      this.enWin2Add()
    }.bind(this));

    this.btn_cancel.addEvent ('click', function () {
      this.disWin2Add()
      this.input_select.focus();
    }.bind(this));

    this.btn_ok.addEvent ('click', function () {
      this.ajaxConex.send(this.input2Add.get('name')+'='+this.input2Add.get('value'));
    }.bind(this));

    // Eventos de Teclado
    this.input_select.addEvent('keypress', function ($ev){
      $ev.stop();
      if ($ev.code == 43) this.btn_add.fireEvent('click');
    }.bind(this));

    this.input2Add.addEvent(
      'keypress', function (e){
        if (e.code == 27) this.btn_cancel.fireEvent('click', e);
        if (e.code == 13) {
          e.stop();
          this.btn_ok.fireEvent('click', e);
        }
      }.bind(this)
    )

  },

  enWin2Add: function () {
    this.win2Add.setStyle ('display', 'block');
    this.input2Add.set ('value', '');
    this.input2Add.focus();
  },

  disWin2Add: function () {
    this.win2Add.setStyle ('display', 'none');
  },

  createAjaxConex: function () {    
    this.ajaxConex = new Request.HTML({
      url: this.link2Add,
      method: 'POST',
      onSuccess: function(){
        this.json_data_server_response = $server_response;
        this.server_response = this.ajaxConex.response.html;
        $server_response = null;

        if (this.json_data_server_response.is_ok) {
          this.renderResponseOk();
        }
        else {
          this.renderResponseError();
        }
        this.disWin2Add();
      }.bind(this)
    });
  },
  renderResponseOk: function () {
    this.input_select.set ('html', this.server_response);
    this.input_select.focus();
  },
  renderResponseError: function () {
    this.win_error.set ('html', this.server_response);
    this.win_error.setStyle('display', 'block');
    (function () {
      this.win_error.setStyle('display', 'none');
      this.win_error.empty();
      this.enWin2Add();
    }.bind(this)).delay (2000);
  }
});