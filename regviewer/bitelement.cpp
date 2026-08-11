#include "bitelement.h"
#include <QGridLayout>
#include "common.h"
#include <QLineEdit>
#include <QGroupBox>
#include <QHBoxLayout>
#include <QDebug>
#include "lineeditfocus.h"

BitElement::BitElement(QWidget *parent) : QWidget(parent)
{
    QGridLayout *mainLayout = new QGridLayout;
    mainLayout->setSpacing(0);
    bitbtns = new Bitbuttons(this, bits);
    line_edits = new BitLineEdits(this, bits);
    bit_operate = new BitOperate(this,bits);
    bit_options = new BitOptions(this, bits);
    reg_display = new RegDisplay(this,bits);
    vars_display = new VarsDisplay(this,bits);
    txt_reg_name = new QLineEdit("");

    QGroupBox * group_cmd = new QGroupBox("Calculator");
    QHBoxLayout * cmd_layout = new QHBoxLayout;
    cmd_layout->setSpacing(0);
    cmd_layout->setMargin(0);
    txt_cmd = new LineEditFocus(this);
    txt_cmd->setText("x");
    txt_cmd->setToolTip("execuate a expression, 'x' for current value, 'Enter' to excuate.");
    cmd_layout->addWidget(txt_cmd);
    group_cmd->setLayout(cmd_layout);

    QGroupBox * group_reg = new QGroupBox("Register Field Display");
    QHBoxLayout * reg_layout = new QHBoxLayout;
    reg_layout->addWidget(txt_reg_name);
    reg_layout->setMargin(0);
    reg_layout->setSpacing(0);
    group_reg->setLayout(reg_layout);
    // row col rowSpan coSpan
    mainLayout->addWidget(bitbtns,		0,0,1,3);
    mainLayout->addWidget(line_edits,	0,3,2,1);
    mainLayout->addWidget(bit_options,	0,4,2,1);
    //---------------------------------------------
    mainLayout->addWidget(bit_operate,	1,0,1,1);
    mainLayout->addWidget(group_cmd,	1,1,1,1);
    mainLayout->addWidget(group_reg,	1,2,1,1);
    //---------------------------------------------
    mainLayout->addWidget(vars_display,	2,0,1,4);
    mainLayout->addWidget(reg_display,	3,0,1,4);
    vars_display->setHidden(true);

    this->setLayout(mainLayout);
    bit_operate->setFixedHeight(50);
    group_cmd->setFixedHeight(50);
    group_reg->setFixedHeight(50);
    connect(txt_reg_name, SIGNAL(textChanged(QString)),this,SLOT(txt_reg_changed(QString)));
    connect(txt_cmd,SIGNAL(returnPressed()),this,SLOT(send_cmd()));
    connect(txt_cmd,SIGNAL(getFocus()),this,SLOT(txt_cmd_get_focus()));
    connect(txt_cmd,SIGNAL(lostFocus()),this,SLOT(txt_cmd_lost_focus()));
}

void BitElement::txt_reg_changed(QString input_str){
    QString name_str = input_str.trimmed().toUpper();
    if (name_str == ""){
        this->txt_reg_name->setStyleSheet("");
        reg_display->clear_display();
        return;
    }
    bool is_reg_name = reg_display->is_reg_name(name_str);
    if (is_reg_name){
        reg_display->set_reg_name(name_str);
        reg_display->update_display();
        this->txt_reg_name->setStyleSheet("");
    }
    else{
        reg_display->clear_display();
        this->txt_reg_name->setStyleSheet("QLineEdit { background-color: #FF8888 }");
    }
}

void BitElement::send_cmd(){
    QString cmd = txt_cmd->text().trimmed();
    TokenMap * tmp_tokenmap = vars_display->get_vars();
    if (cmd.size()==0){
        return;
    } else if (cmd == "clear"){
        vars_display->clear_vars();
        return;
    }
    cmd = convert_hex_in_str(cmd);
    //qDebug() << "expression: " << cmd;
    txt_cmd->setStyleSheet("");
    try {
        packToken my_token = calculator::calculate(cmd.toStdString().c_str(),*tmp_tokenmap);
        if ((!cmd.contains("=")||(cmd.indexOf("=")==cmd.indexOf("==")))){	// no left value, defalut set to 'x'
            bits->set_data((unsigned long long)my_token.asInt());
            vars_display->set_default_value(my_token.asInt());
        }
        else{
            if ((int64_t) bits->get_data()!=vars_display->get_data()){
                bits->set_data(vars_display->get_data());
                //bits->set_data((unsigned long long)vars["x"].asInt());
            }
        }
        vars_display->update_display();
        if (vars_display->get_vars_num()>1){
            vars_display->setHidden(false);
        }
    } catch (...){
        txt_cmd->setStyleSheet("QLineEdit { background-color: #FF8888 }");
        //qDebug() << "Expression Error!";
    }

}

void BitElement::txt_cmd_get_focus(){
    //qDebug() << vars_display->get_vars_num();
    if (vars_display->get_vars_num()>1){
        vars_display->setHidden(false);
    }
}

void BitElement::txt_cmd_lost_focus(){
    vars_display->setHidden(true);
    txt_cmd->setStyleSheet("");
    this->adjustSize();
}
