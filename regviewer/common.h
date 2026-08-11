#ifndef COMMON_H
#define COMMON_H

#define HELP_FILE "help.pdf"
#define REG_DATA_FILE "data/reg_data_armv8.json"
#define DEFAULT_VALUE_FILE "data/default_values.json"
#define FONT_FILE "data/CALIST.TTF"
class QString;

/* convert hex num in str to dec format
 *	e.g. "0x10+100" --> "16+100"
*/
QString convert_hex_in_str(QString input_str);
QString unfold_expression(QString input_str);

#endif // COMMON_H
