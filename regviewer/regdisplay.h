#ifndef REGDISPLAY_H
#define REGDISPLAY_H

#include <QWidget>
#include <bits.h>
#include <QJsonObject>

class QLineEdit;
class QLabel;
class RegInfo;
class QGridLayout;

class RegDisplay : public QWidget
{
    Q_OBJECT
public:
    explicit RegDisplay(QWidget *parent, Bits *bits);
    bool is_reg_name(QString input_name);
    void set_reg_name(QString input_name);
    void clear_display();


private:
    Bits * bits;
    RegInfo * reg_info;
    QJsonObject reg_data_obj;
    QGridLayout * main_layout;
    QString cur_reg_name;

signals:

public slots:
    void update_display();

};

#endif // REGDISPLAY_H
