#include <cmath>

namespace builtin_operations {

// Assignment operator "="
packToken Assign(const packToken& left, const packToken& right, evaluationData* data) {
  packToken& key = data->left->key;
  packToken& origin = data->left->origin;

  // If the left operand has a name:
  if (key->type == CPARSE_STR) {
    std::string& var_name = key.asString();

    // If it is an attribute of a TokenMap:
    if (origin->type == CPARSE_MAP) {
      TokenMap& map = origin.asMap();
      map[var_name] = right;

    // If it is a local variable:
    } else {
      // Find the parent map where this variable is stored:
      TokenMap* map = data->scope.findMap(var_name);

      // Note:
      // It is not possible to assign directly to
      // the global scope. It would be easy for the user
      // to do it by accident, thus:
      if (!map || *map == TokenMap::default_global()) {
        data->scope[var_name] = right;
      } else {
        (*map)[var_name] = right;
      }
    }
  // If the left operand has an index number:
  } else if (key->type & CPARSE_NUM) {
    if (origin->type == CPARSE_LIST) {
      TokenList& list = origin.asList();
      size_t index = key.asInt();
      list[index] = right;
    } else {
      throw std::domain_error("Left operand of assignment is not a list!");
    }
  } else {
    throw undefined_operation(data->op, key, right);
  }
  return right;
}

packToken Comma(const packToken& left, const packToken& right, evaluationData* data) {
  if (left->type == CPARSE_TUPLE) {
    left.asTuple().list().push_back(right);
    return left;
  } else {
    return Tuple(left, right);
  }
}

packToken Colon(const packToken& left, const packToken& right, evaluationData* data) {
  if (left->type == CPARSE_STUPLE) {
    left.asSTuple().list().push_back(right);
    return left;
  } else {
    return STuple(left, right);
  }
}

packToken Equal(const packToken& left, const packToken& right, evaluationData* data) {
  if (left->type == CPARSE_VAR || right->type == CPARSE_VAR) {
    throw undefined_operation(data->op, left, right);
  }

  return left == right;
}

packToken Different(const packToken& left, const packToken& right, evaluationData* data) {
  if (left->type == CPARSE_VAR || right->type == CPARSE_VAR) {
    throw undefined_operation(data->op, left, right);
  }

  return left != right;
}

packToken MapIndex(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  TokenMap& left = p_left.asMap();
  std::string& right = p_right.asString();
  const std::string& op = data->op;

  if (op == "[]" || op == ".") {
    packToken* p_value = left.find(right);

    if (p_value) {
      return RefToken(right, *p_value, left);
    } else {
      return RefToken(right, packToken::None(), left);
    }
  } else {
    throw undefined_operation(op, left, right);
  }
}

// Resolve build-in operations for non-map types, e.g.: 'str'.len()
packToken TypeSpecificFunction(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  if (p_left->type == CPARSE_MAP) throw Operation::Reject();

  TokenMap& attr_map = calculator::type_attribute_map()[p_left->type];
  std::string& key = p_right.asString();

  packToken* attr = attr_map.find(key);
  if (attr) {
    // Note: If attr is a function, it will receive have
    // scope["this"] == source, so it can make changes on this object.
    // Or just read some information for example: its length.
    return RefToken(key, (*attr), p_left);
  } else {
    throw undefined_operation(data->op, p_left, p_right);
  }
}

packToken UnaryNumeralOperation(const packToken& left, const packToken& right, evaluationData* data) {
  const std::string& op = data->op;

  if (op == "+") {
    return right;
  } else if (op == "-") {
    return -right.asDouble();
  } else {
    throw undefined_operation(data->op, left, right);
  }
}

packToken NumeralOperation(const packToken& left, const packToken& right, evaluationData* data) {
//  double left_d, right_d;
  int64_t left_i, right_i;

  // Extract integer and real values of the operators:
//  left_d = left.asDouble();
  left_i = left.asInt();

//  right_d = right.asDouble();
  right_i = right.asInt();

  const std::string& op = data->op;
// edited by lxz
  if (op == "+") {
    return left_i + right_i;
  } else if (op == "*") {
    return left_i * right_i;
  } else if (op == "-") {
    return left_i - right_i;
  } else if (op == "/") {
    return left_i / right_i;
  } else if (op == "<<") {
    return left_i << right_i;
  } else if (op == "**") {
    return pow(left_i, right_i);
  } else if (op == ">>") {
    return left_i >> right_i;
  } else if (op == "%") {
    return left_i % right_i;
  } else if (op == "<") {
    return left_i < right_i;
  } else if (op == ">") {
    return left_i > right_i;
  } else if (op == "<=") {
    return left_i <= right_i;
  } else if (op == ">=") {
    return left_i >= right_i;
  } else if (op == "&&") {
    return left_i && right_i;
  } else if (op == "||") {
    return left_i || right_i;
// add by lxz
  } else if (op == "&") {
    return left_i & right_i;
  } else if (op == "|") {
    return left_i | right_i;
  } else if (op == "^") {
    return left_i ^ right_i;
// lxz add end
  } else {
    throw undefined_operation(op, left, right);
  }
}

packToken FormatOperation(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  std::string& s_left = p_left.asString();
  const char* left = s_left.c_str();

  Tuple right;

  if (p_right->type == CPARSE_TUPLE) {
    right = p_right.asTuple();
  } else {
    right = Tuple(p_right);
  }

  std::string result;
  for (const packToken& token : right.list()) {
    // Find the next occurrence of "%s"
    while (*left && (*left != '%' || left[1] != 's')) {
      if (*left == '\\' && left[1] == '%') ++left;
      result.push_back(*left);
      ++left;
    }

    if (*left == '\0') {
      throw type_error("Not all arguments converted during string formatting");
    } else {
      left += 2;
    }

    // Replace it by the token string representation:
    if (token->type == CPARSE_STR) {
      // Avoid using packToken::str for strings
      // or it will enclose it quotes `"str"`
      result += token.asString();
    } else {
      result += token.str();
    }
  }

  // Find the next occurrence of "%s" if exists:
  while (*left && (*left != '%' || left[1] != 's')) {
    if (*left == '\\' && left[1] == '%') ++left;
    result.push_back(*left);
    ++left;
  }

  if (*left != '\0') {
    throw type_error("Not enough arguments for format string");
  } else {
    return result;
  }
}

packToken StringOnStringOperation(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  const std::string& left = p_left.asString();
  const std::string& right = p_right.asString();
  const std::string& op = data->op;

  if (op == "+") {
    return left + right;
  } else if (op == "==") {
    return (left == right);
  } else if (op == "!=") {
    return (left != right);
  } else {
    throw undefined_operation(op, p_left, p_right);
  }
}

packToken StringOnNumberOperation(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  const std::string& left = p_left.asString();
  const std::string& op = data->op;

  std::stringstream ss;
  if (op == "+") {
    ss << left << p_right.asDouble();
    return ss.str();
  } else if (op == "[]") {
    int64_t index = p_right.asInt();

    if (index < 0) {
      // Reverse index, i.e. list[-1] = list[list.size()-1]
      index += left.size();
    }
    if (index < 0 || static_cast<size_t>(index) >= left.size()) {
      throw std::domain_error("String index out of range!");
    }

    ss << left[index];
    return ss.str();
  } else {
    throw undefined_operation(op, p_left, p_right);
  }
}

packToken NumberOnStringOperation(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  double left = p_left.asDouble();
  const std::string& right = p_right.asString();

  std::stringstream ss;
  if (data->op == "+") {
    ss << left << right;
    return ss.str();
  } else {
    throw undefined_operation(data->op, p_left, p_right);
  }
}

packToken ListOnNumberOperation(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  TokenList left = p_left.asList();

  if (data->op == "[]") {
    int64_t index = p_right.asInt();

    if (index < 0) {
      // Reverse index, i.e. list[-1] = list[list.size()-1]
      index += left.list().size();
    }

    if (index < 0 || static_cast<size_t>(index) >= left.list().size()) {
      throw std::domain_error("List index out of range!");
    }

    packToken& value = left.list()[index];

    return RefToken(index, value, p_left);
  } else {
    throw undefined_operation(data->op, p_left, p_right);
  }
}

packToken ListOnListOperation(const packToken& p_left, const packToken& p_right, evaluationData* data) {
  TokenList& left = p_left.asList();
  TokenList& right = p_right.asList();

  if (data->op == "+") {
    // Deep copy the first list:
    TokenList result;
    result.list() = left.list();

    // Insert items from the right list into the left:
    for (packToken& p : right.list()) {
      result.list().push_back(p);
    }

    return result;
  } else {
    throw undefined_operation(data->op, left, right);
  }
}

struct Startup {
  Startup() {
    // Create the operator precedence map based on C++ default
    // precedence order as described on cppreference website:
    // http://en.cppreference.com/w/cpp/language/operator_precedence
    OppMap_t& opp = calculator::Default().opPrecedence;
    opp.add("[]", 2); opp.add("()", 2); opp.add(".", 2);
    opp.add("**", 3);
    opp.add("*",  5); opp.add("/", 5); opp.add("%", 5);
    opp.add("+",  6); opp.add("-", 6);
    opp.add("<<", 7); opp.add(">>", 7);
    opp.add("<",  8); opp.add("<=", 8); opp.add(">=", 8); opp.add(">", 8);
    opp.add("==", 9); opp.add("!=", 9);
    opp.add("&", 10);
    opp.add("^", 11);
    opp.add("|", 12);
    opp.add("&&", 13);
    opp.add("||", 14);
    opp.add("=", 15); opp.add(":", 15);
    opp.add(",", 16);

    // Add unary operators:
    opp.addUnary("+",  3); opp.addUnary("-", 3);

    // Link operations to respective operators:
    opMap_t& opMap = calculator::Default().opMap;
    opMap.add({CPARSE_ANY_TYPE, "=", CPARSE_ANY_TYPE}, &Assign);
    opMap.add({CPARSE_ANY_TYPE, ",", CPARSE_ANY_TYPE}, &Comma);
    opMap.add({CPARSE_ANY_TYPE, ":", CPARSE_ANY_TYPE}, &Colon);
    opMap.add({CPARSE_ANY_TYPE, "==", CPARSE_ANY_TYPE}, &Equal);
    opMap.add({CPARSE_ANY_TYPE, "!=", CPARSE_ANY_TYPE}, &Different);
    opMap.add({CPARSE_MAP, 		"[]", CPARSE_STR}, &MapIndex);
    opMap.add({CPARSE_ANY_TYPE, ".", CPARSE_STR}, &TypeSpecificFunction);
    opMap.add({CPARSE_MAP, 		".", CPARSE_STR}, &MapIndex);
    opMap.add({CPARSE_STR, 		"%", CPARSE_ANY_TYPE}, &FormatOperation);

    // Note: The order is important:
    opMap.add({CPARSE_NUM, ANY_OP, CPARSE_NUM}, &NumeralOperation);
    opMap.add({CPARSE_UNARY, ANY_OP, CPARSE_NUM}, &UnaryNumeralOperation);
    opMap.add({CPARSE_STR, ANY_OP, CPARSE_STR}, &StringOnStringOperation);
    opMap.add({CPARSE_STR, ANY_OP, CPARSE_NUM}, &StringOnNumberOperation);
    opMap.add({CPARSE_NUM, ANY_OP, CPARSE_STR}, &NumberOnStringOperation);
    opMap.add({CPARSE_LIST, ANY_OP, CPARSE_NUM}, &ListOnNumberOperation);
    opMap.add({CPARSE_LIST, ANY_OP, CPARSE_LIST}, &ListOnListOperation);
  }
} __CPARSE_STARTUP;

}  // namespace builtin_operations
