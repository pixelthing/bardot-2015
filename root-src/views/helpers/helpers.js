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

  Handlebars.registerHelper('setVariable', function (name, value)  { 
    console.log(name, value);
    this[name] = value;
  });

  Handlebars.registerHelper('lastItem', function(context, block) {
    return this[Object.keys(this)[Object.keys(this).length - 2]];
  });
};