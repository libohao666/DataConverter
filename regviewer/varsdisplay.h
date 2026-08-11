#ifndef VARSDISPLAY_H
#define VARSDISPLAY_H

#include <QWidget>
#include "shunting-yard.h"
#include "bits.h"
class QPushButton;
class QGridLayout;
class QTableView;
class QLabel;
class VarsDisplay : public QWidget
{
    Q_OBJECT
public:
    TokenMap vars;
    Bits * bits;
    explicit VarsDisplay(QWidget *parent,Bits *bits);
    int64_t get_data();
    TokenMap * get_vars();
    int get_vars_num();
    void set_default_value(int64_t num);
    QPushButton * btn_clear;
    QLabel * label_vars;
    QGridLayout * main_layout;
    QTableView * data_table;


signals:

public slots:
    void clear_vars();
    void update_display();
};

#endif // VARSDISPLAY_H
