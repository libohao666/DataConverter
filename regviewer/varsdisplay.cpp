#include "varsdisplay.h"
#include <QPushButton>
#include <QGridLayout>
#include <QTableView>
#include <QStandardItemModel>
#include <QHeaderView>
#include "shunting-yard.h"
#include <QLabel>

#define DEFAULT_VAR "x"
VarsDisplay::VarsDisplay(QWidget *parent,Bits * bits) : QWidget(parent)
{
    this->bits = bits;
    vars[DEFAULT_VAR] = (int64_t)bits->get_data();
    btn_clear = new QPushButton("clear");
    label_vars = new QLabel("Vars:");
    label_vars->setAlignment(Qt::AlignRight);
    btn_clear->setFixedWidth(50);
    main_layout = new QGridLayout;
    data_table = new QTableView;
    data_table->verticalHeader()->setDefaultSectionSize(15);
    data_table->verticalHeader()->setHidden(true);
    data_table->horizontalHeader()->setHidden(true);
    data_table->setShowGrid(false);

    main_layout->addWidget(btn_clear,1,0);
    main_layout->addWidget(label_vars,0,0);
    main_layout->addWidget(data_table,0,1,2,1);
    this->setLayout(main_layout);
    connect(bits, SIGNAL(value_changed()),this,SLOT(update_display()));
    connect(btn_clear,SIGNAL(clicked(bool)),this,SLOT(clear_vars()));
}

#define DIV_WIDTH 130
void VarsDisplay::update_display(){
    QStandardItemModel *model = new QStandardItemModel();
    QString var_name,var_value;
    int count = 0;
    int row,column;
    data_table->setModel(model);
    vars[DEFAULT_VAR] = (int64_t)bits->get_data();
    auto map = vars.map();
    QStandardItem * div_item = new QStandardItem("|");
    div_item->setTextAlignment(Qt::AlignCenter);
    //div_item->setBackground(QBrush(QColor(239,239,239)));

    for(auto it = map.begin(); it!=map.end(); it++){
        row = count/3;
        column = count%3;
        var_name = QString::fromStdString(it->first);
        var_value = "0x"+QString::number(it->second.asInt(),16).toUpper();
        if (var_name!=DEFAULT_VAR){
            if (column>0){
                model->setItem(row,column*3-1,div_item->clone());
            }
            model->setItem(row,column*3,new QStandardItem(var_name+":"));
            model->setItem(row,column*3+1,new QStandardItem(var_value));
            count ++;
        }
    }
    data_table->setColumnWidth(0,80);
    data_table->setColumnWidth(1,150);
    data_table->setColumnWidth(2,DIV_WIDTH);
    data_table->setColumnWidth(3,80);
    data_table->setColumnWidth(4,150);
    data_table->setColumnWidth(5,DIV_WIDTH);
    data_table->setColumnWidth(6,80);
    data_table->setColumnWidth(7,150);
}

void VarsDisplay::clear_vars(){
    int tmp_height = this->height();
    vars.map().clear();
    vars[DEFAULT_VAR] = (int64_t)bits->get_data();
    update_display();
    this->setHidden(true);
    ((QWidget *)(this->parent()))->adjustSize();
}

int64_t VarsDisplay::get_data(){
    return vars[DEFAULT_VAR].asInt();
}

TokenMap * VarsDisplay::get_vars(){
    return &vars;
}

int VarsDisplay::get_vars_num(){
    return vars.map().size();
}

void VarsDisplay::set_default_value(int64_t num){
    vars[DEFAULT_VAR] = num;
}
