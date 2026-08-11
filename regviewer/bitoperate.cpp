#include "bitoperate.h"
#include <QHBoxLayout>
#include <QLineEdit>
#include <QCheckBox>
#include <QPushButton>
#include <QWidget>
#include <QRegExpValidator>
#include <QComboBox>
#include <QLabel>
#include <algorithm>
#include <QMessageBox>
#include <sstream>
#include <QDebug>
#include <QGroupBox>

BitOperate::BitOperate(QWidget *parent, Bits *bits) : QWidget(parent)
{
    this->bits = bits;
    QHBoxLayout *mainLayout = new QHBoxLayout;
    mainLayout->setMargin(0);
    mainLayout->setSpacing(0);

/*********** set *********************************/
    QGroupBox * group_set =  new QGroupBox("Bit Modify");
    QHBoxLayout * set_layout = new QHBoxLayout;
    set_layout->setMargin(0);
    set_layout->setSpacing(0);
    group_set->setFixedWidth(170);
    label_to = new QLabel("-");
    bit_range_from = new QLineEdit("0",this);
    bit_range_to = new QLineEdit("63",this);
    btn_clear = new QPushButton("0", this);
    btn_set = new QPushButton("1", this);
    btn_reverse = new QPushButton("~", this);
    btn_extract = new QPushButton("E",this);
    btn_clear->setToolTip("<b>Clear</b> the bits in the range.");
    btn_set->setToolTip("<b>Set</b> the bits in the range.");
    btn_reverse->setToolTip("<b>Reverse</b> the bits in the range.");
    btn_extract->setToolTip("<b>Extract</b> the bits in the range.");
    label_to->setFixedWidth(10);
    bit_range_from->setAlignment(Qt::AlignCenter);
    bit_range_from->setAlignment(Qt::AlignCenter);
#ifdef Q_OS_WIN
    bit_range_from->setFixedWidth(24);
    bit_range_to->setFixedWidth(24);
#endif

    label_to->setAlignment(Qt::AlignCenter);

    QRegExp rx_dec("[0-9]+");
    QValidator *dec_validator = new QRegExpValidator(rx_dec, this);
    bit_range_to->setValidator(dec_validator);
    bit_range_to->setMaxLength(2);
    bit_range_to->setAlignment(Qt::AlignCenter);

    set_layout->addWidget(bit_range_from);
    set_layout->addWidget(label_to);
    set_layout->addWidget(bit_range_to);
    set_layout->addWidget(btn_clear);
    set_layout->addWidget(btn_set);
    set_layout->addWidget(btn_reverse);
    set_layout->addWidget(btn_extract);
    group_set->setLayout(set_layout);

/*********** shift ******************************/
    QGroupBox * group_shift = new QGroupBox("Shift");
    QHBoxLayout *shiftLayout = new QHBoxLayout;
    shiftLayout->setSpacing(0);
    shiftLayout->setMargin(0);
    btn_shift_left = new QPushButton("<<",this);
    txt_shift_bit_num = new QLineEdit("0",this);
    btn_shift_right = new QPushButton(">>",this);
    shift_mode = new QComboBox(this);
    shift_mode->setToolTip("Shift Mode");
    shift_mode->addItem("Logic");
    shift_mode->addItem("Arith");
    shift_mode->addItem("Rotate");
    shift_mode->setEditable(false);
    txt_shift_bit_num->setValidator(dec_validator);
    txt_shift_bit_num->setMaxLength(2);
    txt_shift_bit_num->setAlignment(Qt::AlignCenter);
    bit_range_from->setValidator(dec_validator);
    bit_range_from->setMaxLength(2);
    bit_range_from->setAlignment(Qt::AlignCenter);

    btn_shift_left->setFixedWidth(25);
    txt_shift_bit_num->setFixedWidth(25);
    btn_shift_right->setFixedWidth(25);
    group_shift->setFixedWidth(140);
    shiftLayout->addWidget(btn_shift_left);
    shiftLayout->addWidget(txt_shift_bit_num);
    shiftLayout->addWidget(btn_shift_right);
    shiftLayout->addWidget(shift_mode);
    group_shift->setLayout(shiftLayout);

/**************** cmd ****************************/

    mainLayout->addWidget(group_set);
    mainLayout->addWidget(group_shift);
    this->setLayout(mainLayout);
    txt_shift_bit_num->setText("1");
//    btn_clear->setFocusPolicy(Qt::NoFocus);
//    btn_reverse->setFocusPolicy(Qt::NoFocus);
//    btn_set->setFocusPolicy(Qt::NoFocus);
//    btn_shift_left->setFocusPolicy(Qt::NoFocus);
//    btn_shift_right->setFocusPolicy(Qt::NoFocus);
//    shift_mode->setFocusPolicy(Qt::NoFocus);
    connect(shift_mode,SIGNAL(currentTextChanged(QString)),this,SLOT(set_shift_mode(QString)));
    connect(btn_clear,SIGNAL(clicked(bool)),this,SLOT(clear_num()));
    connect(btn_reverse,SIGNAL(clicked(bool)),this,SLOT(reverse_num()));
    connect(btn_set,SIGNAL(clicked(bool)),this,SLOT(set_num()));
    connect(btn_extract,SIGNAL(clicked(bool)),this,SLOT(extract_num()));
    connect(btn_shift_left,SIGNAL(clicked(bool)),this,SLOT(shift_left()));
    connect(btn_shift_right,SIGNAL(clicked(bool)),this,SLOT(shift_right()));
    connect(bits,SIGNAL(value_changed()),this,SLOT(update_display()));
}

int BitOperate::get_range_start(){
    int temp1, temp2;
    int start,max_end;
    temp1 = this->bit_range_from->text().toInt();
    temp2 = this->bit_range_to->text().toInt();
    max_end = (int)bits->get_width()-1;
    if (temp1>max_end && temp2 > max_end)
        start = -1;
    else
        start = std::min(temp1,temp2);
    return start;
}

int BitOperate::get_range_end(){
    int temp1, temp2;
    int end,max_end;
    temp1 = this->bit_range_from->text().toInt();
    temp2 = this->bit_range_to->text().toInt();
    max_end = (int)bits->get_width()-1;
    if (temp1>max_end && temp2 > max_end)
        end = -1;
    else
        end = std::max(temp1,temp2);
    return std::min(end,(int)bits->get_width()-1);

}

void BitOperate::clear_num(){
    if ((get_range_end()==-1)||(get_range_start()==-1)){
        QMessageBox msgBox;
        msgBox.setText("Please check the range!");
        msgBox.exec();
        return;
    }else{
        bits->clear_bits(get_range_start(),get_range_end());
    }
}
void BitOperate::set_num(){
    if ((get_range_end()==-1)||(get_range_start()==-1)){
        QMessageBox msgBox;
        msgBox.setText("Please check the range!");
        msgBox.exec();
        return;
    }else{
        bits->set_bits(get_range_start(),get_range_end());
    }
}
void BitOperate::reverse_num(){
    if ((get_range_end()==-1)||(get_range_start()==-1)){
        QMessageBox msgBox;
        msgBox.setText("Please check the range!");
        msgBox.exec();
        return;
    }else{
        bits->reverse_bits(get_range_start(),get_range_end());
    }
}

void BitOperate::extract_num(){
    if ((get_range_end()==-1)||(get_range_start()==-1)){
        QMessageBox msgBox;
        msgBox.setText("Please check the range!");
        msgBox.exec();
        return;
    }else{
        bits->set_data(bits->get_sub_data(get_range_start(),get_range_end()));
    }
}

void BitOperate::shift_left(){
    int shift_bits = this->txt_shift_bit_num->text().toInt();
    bits->shift_left(shift_bits);
}

void BitOperate::shift_right(){
    int shift_bits = this->txt_shift_bit_num->text().toInt();
    bits->shift_right(shift_bits);
}

void BitOperate::update_display(){
    switch (bits->get_shift_mode()){
        case Bits::SHF_LOGIC:
            shift_mode->setCurrentText("Logic");
            break;
        case Bits::SHF_ARITH:
            shift_mode->setCurrentText("Arith");
            break;
        case Bits::SHF_ROTATE:
            shift_mode->setCurrentText("Rotate");
            break;
    }
}

void BitOperate::set_shift_mode(QString mode){
    if (mode=="Logic")
        bits->set_shift_mode(Bits::SHF_LOGIC);
    else if (mode=="Arith")
        bits->set_shift_mode(Bits::SHF_ARITH);
    else if (mode=="Rotate")
        bits->set_shift_mode(Bits::SHF_ROTATE);
}
