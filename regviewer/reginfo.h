#ifndef REGINFO_H
#define REGINFO_H
#include <QJsonObject>
#include <QList>
#include <QWidget>
#include <QHBoxLayout>
#include <QString>

class QLabel;
class QStringList;
class Bits;
class QVBoxLayout;
class FlowLayout;

class FieldInfo{
public:
    QString field_name;
    QString field_full_name;
    QStringList display_value;
    QString display_format;
    int	start_bit;
    int end_bit;
    FieldInfo(QJsonObject obj,Bits * bits);
    QWidget * build();
private:
    Bits *bits;
    unsigned long long get_field_data();
    QString get_field_string();
};

class FieldGroup{
public:
    QStringList conds;
    QList<FieldInfo> field_infos;
    FieldGroup(QJsonObject obj, Bits * bits);
public:
    QList<QWidget*> build();
private:
    Bits *bits;
};

class RegInfo  : public QWidget
{
    Q_OBJECT
public:
    int width;
    QString reg_name;
    QString full_name;
    QString address;
    QList<FieldGroup> field_groups;
    Bits *bits;

private:
    QLabel * label_head;
    QList<QWidget * > widget_field_list;
    QGridLayout *mainLayout;
    QJsonObject reg_data_obj;
    QJsonObject reg_default_obj;
    FieldGroup get_right_field_group();
    bool is_cond_fit(QStringList cond);
    QString replace_reg_by_value(QString input_str);
    unsigned long long get_reg_value_by_addr(QString reg_addr);

public:
    explicit RegInfo(QWidget *parent, QJsonObject obj, Bits * bits);
    void set_reg_name(QString input_name);
    void build();
    void update_display(QString reg_name);
    void clean_display();
    void clean();

};

#endif // REGINFO_H
