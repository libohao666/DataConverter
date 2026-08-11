#include <sstream>
#include <string>
#include <iostream>

#include "./shunting-yard.h"
#include "./packToken.h"
#include "./shunting-yard-exceptions.h"

const packToken& packToken::None() {
  static packToken none = packToken(TokenNone());
  return none;
}

packToken::strFunc_t& packToken::str_custom() {
  static strFunc_t func = 0;
  return func;
}

packToken::packToken(const TokenMap& map) : base(new TokenMap(map)) {}
packToken::packToken(const TokenList& list) : base(new TokenList(list)) {}

packToken& packToken::operator=(const packToken& t) {
  delete base;
  base = t.base->clone();
  return *this;
}

bool packToken::operator==(const packToken& token) const {
  if (CPARSE_NUM & token.base->type & base->type) {
    return token.asDouble() == asDouble();
  }

  if (token.base->type != base->type) {
    return false;
  } else {
    // Compare strings to simplify code
    return token.str() == str();
  }
}

bool packToken::operator!=(const packToken& token) const {
  return !(*this == token);
}

TokenBase* packToken::operator->() const {
  return base;
}

std::ostream& operator<<(std::ostream &os, const packToken& t) {
  return os << t.str();
}

packToken& packToken::operator[](const std::string& key) {
  if (base->type != CPARSE_MAP) {
    throw bad_cast(
      "The Token is not a map!");
  }
  return (*static_cast<TokenMap*>(base))[key];
}
const packToken& packToken::operator[](const std::string& key) const {
  if (base->type != CPARSE_MAP) {
    throw bad_cast(
      "The Token is not a map!");
  }
  return (*static_cast<TokenMap*>(base))[key];
}
packToken& packToken::operator[](const char* key) {
  if (base->type != CPARSE_MAP) {
    throw bad_cast(
      "The Token is not a map!");
  }
  return (*static_cast<TokenMap*>(base))[key];
}
const packToken& packToken::operator[](const char* key) const {
  if (base->type != CPARSE_MAP) {
    throw bad_cast(
      "The Token is not a map!");
  }
  return (*static_cast<TokenMap*>(base))[key];
}

bool packToken::asBool() const {
  switch (base->type) {
    case CPARSE_REAL:
      return static_cast<Token<double>*>(base)->val != 0;
    case CPARSE_INT:
      return static_cast<Token<int64_t>*>(base)->val != 0;
    case CPARSE_BOOL:
      return static_cast<Token<uint8_t>*>(base)->val != 0;
    case CPARSE_STR:
      return static_cast<Token<std::string>*>(base)->val != std::string();
    case CPARSE_MAP:
    case CPARSE_FUNC:
      return true;
    case CPARSE_NONE:
      return false;
    case CPARSE_TUPLE:
    case CPARSE_STUPLE:
      return static_cast<Tuple*>(base)->list().size() != 0;
    default:
      throw bad_cast("Token type can not be cast to boolean!");
  }
}

double packToken::asDouble() const {
  switch (base->type) {
  case CPARSE_REAL:
    std::cout << "NOTICE: a double number!!! at asDouble()" << std::endl;
    return static_cast<Token<double>*>(base)->val;
  case CPARSE_INT:
    return static_cast<Token<int64_t>*>(base)->val;
  case CPARSE_BOOL:
    return static_cast<Token<uint8_t>*>(base)->val;
  default:
    if (!(base->type & CPARSE_NUM)) {
      throw bad_cast(
        "The Token is not a number!");
    } else {
      throw bad_cast(
        "Unknown numerical type, can't convert it to double!");
    }
  }
}

int64_t packToken::asInt() const {
  switch (base->type) {
  case CPARSE_REAL:
    std::cout << "NOTICE: a double number!!! at asInt()" << std::endl;
    return static_cast<Token<double>*>(base)->val;
  case CPARSE_INT:
    return static_cast<Token<int64_t>*>(base)->val;
  case CPARSE_BOOL:
    return static_cast<Token<uint8_t>*>(base)->val;
  default:
    if (!(base->type & CPARSE_NUM)) {
      throw bad_cast(
        "The Token is not a number!");
    } else {
      throw bad_cast(
        "Unknown numerical type, can't convert it to integer!");
    }
  }
}

std::string& packToken::asString() const {
  if (base->type != CPARSE_STR && base->type != CPARSE_VAR && base->type != CPARSE_OP) {
    throw bad_cast(
      "The Token is not a string!");
  }
  return static_cast<Token<std::string>*>(base)->val;
}

TokenMap& packToken::asMap() const {
  if (base->type != CPARSE_MAP) {
    throw bad_cast(
      "The Token is not a map!");
  }
  return *static_cast<TokenMap*>(base);
}

TokenList& packToken::asList() const {
  if (base->type != CPARSE_LIST) {
    throw bad_cast(
      "The Token is not a list!");
  }
  return *static_cast<TokenList*>(base);
}

Tuple& packToken::asTuple() const {
  if (base->type != CPARSE_TUPLE) {
    throw bad_cast(
      "The Token is not a tuple!");
  }
  return *static_cast<Tuple*>(base);
}

STuple& packToken::asSTuple() const {
  if (base->type != CPARSE_STUPLE) {
    throw bad_cast(
      "The Token is not an special tuple!");
  }
  return *static_cast<STuple*>(base);
}

Function* packToken::asFunc() const {
  if (base->type != CPARSE_FUNC) {
    throw bad_cast(
      "The Token is not a function!");
  }
  return static_cast<Function*>(base);
}

std::string packToken::str(uint32_t nest) const {
  return packToken::str(base, nest);
}

std::string packToken::str(const TokenBase* base, uint32_t nest) {
  std::stringstream ss;
  TokenMap_t* tmap;
  TokenMap_t::iterator m_it;

  TokenList_t* tlist;
  TokenList_t::iterator l_it;
  const Function* func;
  bool first, boolval;
  std::string name;

  if (!base) return "undefined";

  if (base->type & CPARSE_REF) {
    base = static_cast<const RefToken*>(base)->resolve();
    name = static_cast<const RefToken*>(base)->key.str();
  }

  /* * * * * Check for a user defined functions: * * * * */

  if (packToken::str_custom()) {
    std::string result = packToken::str_custom()(base, nest);
    if (result != "") {
      return result;
    }
  }

  /* * * * * Stringify the token: * * * * */

  switch (base->type) {
    case CPARSE_NONE:
      return "None";
    case CPARSE_UNARY:
      return "UnaryToken";
    case CPARSE_OP:
      return static_cast<const Token<std::string>*>(base)->val;
    case CPARSE_VAR:
      return static_cast<const Token<std::string>*>(base)->val;
    case CPARSE_REAL:
      ss << static_cast<const Token<double>*>(base)->val;
      return ss.str();
    case CPARSE_INT:
      ss << static_cast<const Token<int64_t>*>(base)->val;
      return ss.str();
    case CPARSE_BOOL:
      boolval = static_cast<const Token<uint8_t>*>(base)->val;
      return boolval ? "True" : "False";
    case CPARSE_STR:
      return "\"" + static_cast<const Token<std::string>*>(base)->val + "\"";
    case CPARSE_FUNC:
      func = static_cast<const Function*>(base);
      if (func->name().size()) return "[Function: " + func->name() + "]";
      if (name.size()) return "[Function: " + name + "]";
      return "[Function]";
    case CPARSE_TUPLE:
    case CPARSE_STUPLE:
      if (nest == 0) return "[Tuple]";
      ss << "(";
      first = true;
      for (const packToken token : static_cast<const Tuple*>(base)->list()) {
        if (!first) {
          ss << ", ";
        } else {
          first = false;
        }
        ss << str(token.token(), nest-1);
      }
      if (first) {
        // Its an empty tuple:
        // Add a `,` to make it different than ():
        ss << ",)";
      } else {
        ss << ")";
      }
      return ss.str();
    case CPARSE_MAP:
      if (nest == 0) return "[Map]";
      tmap = &(static_cast<const TokenMap*>(base)->map());
      if (tmap->size() == 0) return "{}";
      ss << "{";
      for (m_it = tmap->begin(); m_it != tmap->end(); ++m_it) {
        ss << (m_it == tmap->begin() ? "" : ",");
        ss << " \"" << m_it->first << "\": " << m_it->second.str(nest-1);
      }
      ss << " }";
      return ss.str();
    case CPARSE_LIST:
      if (nest == 0) return "[List]";
      tlist = &(static_cast<const TokenList*>(base)->list());
      if (tlist->size() == 0) return "[]";
      ss << "[";
      for (l_it = tlist->begin(); l_it != tlist->end(); ++l_it) {
        ss << (l_it == tlist->begin() ? "" : ",");
        ss << " " << l_it->str(nest-1);
      }
      ss << " ]";
      return ss.str();
    default:
      if (base->type & CPARSE_IT) {
        return "[Iterator]";
      }
      return "unknown_type";
  }
}
