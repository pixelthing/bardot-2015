module.exports.register = function (Handlebars, options)  { 
  
  Handlebars.registerHelper('simplify', function (str, options)  { 
    
    str = str.toLowerCase();
    str = str.replace(/[ö]+/ig, 'o');
    str = str.replace(/[ä]+/ig, 'a');
    str = str.replace(/[å]+/ig, 'a');
    str = str.replace(/[é]+/ig, 'e');
    str = str.replace(/[\s]+/ig, '-');
    console.log(str);
    return str;

  });

  Handlebars.registerHelper("thumbHeight", function(ratio) {
    var thumbHeight = Math.round( 100 * ratio );
    return thumbHeight;
  });

  Handlebars.registerHelper('setLastSpread', function (value)  { 
    console.log(value);
    Handlebars.lastSpread = value;
  });

  Handlebars.registerHelper('setVariable', function (name, value)  { 
    console.log(name, value);
    this[name] = value;
  });

  Handlebars.registerHelper('isEqual', function (val1, val2)  { 
    if (val1 == val2) {
      return true;
    }
  });

  Handlebars.registerHelper('lastItem', function(context, block) {
    return this[Object.keys(this)[Object.keys(this).length - 2]];
  });
};