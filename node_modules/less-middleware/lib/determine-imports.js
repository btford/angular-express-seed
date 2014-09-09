var fs = require('fs'),
  path = require('path');

module.exports = function (tree, lessPath, additional_import_paths) {
  additional_import_paths = additional_import_paths || [];

  var less_root_dir = path.dirname(lessPath);
  var result = new ImportSet();

  process_tree_node(tree, less_root_dir, less_root_dir, additional_import_paths, result);

  return result.items;
};

// Process each less file node, with a list of rules
var process_tree_node = module.exports.process_tree_node = function (node, current_dir, root_dir, additional_import_paths, imports) {
  // When a less file is imported twice it comes through with an undefined node.
  if (node === undefined) {
    return false;
  }

  var import_rules = node.rules
    .filter(function (rule) {
      return rule.path && !rule.css;
    });

  import_rules.forEach(function (import_rule) {
    process_import_rule(import_rule, current_dir, root_dir, additional_import_paths, imports);
  });
};

// Process an import rule, with a path and a single less file node
var process_import_rule = module.exports.process_import_rule = function process_import_rule(import_rule, current_dir, root_dir, additional_import_paths, imports) {
  var found_path = locate(import_rule.path, current_dir, root_dir, additional_import_paths);
  var this_import = {
    mtime: Date.now(),
    path: found_path
  };
  imports.add(this_import);
  var new_current_dir = path.dirname(found_path);
  process_tree_node(import_rule.root, new_current_dir, root_dir, additional_import_paths, imports);
};

// Less imports check for the path first in the local directory of the file,
// and then again in the directory of the top level less file being imported.
var locate = module.exports.locate = function (filename, current_dir, root_dir, additional_import_paths) {
  var i, import_path, from_import_path;
  filename = filename.value;
  if (!filename.match(/\.(css|less)$/))
      filename += '.less';
  var from_current_path = path.join(current_dir, filename);
  var from_root_path = path.join(root_dir, filename);
  
  if (fs.existsSync(from_current_path)) {
    return from_current_path;
  }

  if (fs.existsSync(from_root_path)){
    return from_root_path;
  }

  for(i = 0; i < additional_import_paths.length; i++){
    import_path = additional_import_paths[i];
    from_import_path = path.join(import_path, filename);
    if (fs.existsSync(from_import_path)) {
      return from_import_path;
    }
  }

  throw new Error("'"+filename+"' wasn't found.");
};


// It's quick to check here for duplicate items,
// and it avoids an fs call in the middleware proper
var ImportSet = module.exports.ImportSet = function(){
  this.items = [];
};

ImportSet.prototype.add = function(item){
  var that = this;
  if (!already_in(item)){
    this.items.push(item);
  }

  function already_in(item){
    return that.items.some(function(element){
      return element.path === item.path;
    });
  }
};
