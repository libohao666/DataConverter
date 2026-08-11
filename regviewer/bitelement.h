#ifndef BITELEMENT_H
#define BITELEMENT_H

#include <QWidget>
#include "bitbuttons.h"
#include "bitlineedits.h"
#include "bitoperate.h"
#include "bits.h"
#include "bitoptions.h"
#include "regdisplay.h"
#include "varsdisplay.h"

class QPushButton;
class QLineEdit;
class LineEditFocus;

class BitElement : public QWidget
{
    Q_OBJECT
public:
    explicit BitElement(QWidget *parent = nullptr);
private:
    Bitbuttons * bitbtns;
    BitLineEdits * line_edits;
    BitOperate * bit_operate;
    BitOptions * bit_options;
    Bits * bits = new Bits(64);
    QPushButton * btn_more;
    RegDisplay * reg_display;
    QLineEdit * txt_reg_name;
    LineEditFocus   * txt_cmd;
    VarsDisplay * vars_display;

signals:

public slots:
    void txt_reg_changed(QString input_str);
    void txt_cmd_get_focus();
    void txt_cmd_lost_focus();
    void send_cmd();
};

#endif // BITELEMENT_H
