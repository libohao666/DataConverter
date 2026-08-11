#include "bitoptions.h"
#include <QGridLayout>
#include <QVBoxLayout>
#include <QGroupBox>
#define	HEIGHT 130
#define	WIDTH_S 50
BitOptions::BitOptions(QWidget *parent, Bits * bits) : QWidget(parent)
{
    this->bits = bits;
    QGridLayout *group_layout = new QGridLayout;
    QVBoxLayout *main_layout = new QVBoxLayout;
    group_layout->setMargin(0);
    group_layout->setSpacing(0);
    main_layout->setMargin(0);
    main_layout->setSpacing(0);
    QGroupBox * group_option = new QGroupBox("Option",this);
    group_layout->setSpacing(0);
    this->setFixedHeight(HEIGHT);
    this->setFixedWidth(WIDTH_S);
    btn_8 = new QRadioButton("8");
    btn_16 = new QRadioButton("16");
    btn_32 = new QRadioButton("32");
    btn_64 = new QRadioButton("64");
    about_dialog = new AboutDialog();
    ckbox_always_on_top = new QCheckBox("Top");
    group_layout->addWidget(btn_8,			0,0,1,1);
    group_layout->addWidget(btn_16,	    	1,0,1,1);
    group_layout->addWidget(btn_32,			2,0,1,1);
    group_layout->addWidget(btn_64,			3,0,1,1);
    group_layout->addWidget(ckbox_always_on_top,4,0,1,1);
    btn_about = new QPushButton("?...");
    btn_about->setToolTip("Help & About");
    group_layout->addWidget(btn_about,5,0,1,1);
    btn_8->setFocusPolicy(Qt::NoFocus);
    btn_16->setFocusPolicy(Qt::NoFocus);
    btn_32->setFocusPolicy(Qt::NoFocus);
    btn_64->setFocusPolicy(Qt::NoFocus);
    ckbox_always_on_top->setFocusPolicy(Qt::NoFocus);
    ckbox_always_on_top->setToolTip("keep this window <b>Always on Top</b>");
    main_layout->addWidget(group_option);
    group_option->setLayout(group_layout);
    this->setLayout(main_layout);


    update_display();
    connect(btn_8,SIGNAL(toggled(bool)),this,SLOT(change_width()));
    connect(btn_16,SIGNAL(toggled(bool)),this,SLOT(change_width()));
    connect(btn_32,SIGNAL(toggled(bool)),this,SLOT(change_width()));
    connect(btn_64,SIGNAL(toggled(bool)),this,SLOT(change_width()));
    connect(btn_about,SIGNAL(clicked(bool)),this,SLOT(show_about_dialog()));
    connect(this->ckbox_always_on_top,SIGNAL(stateChanged(int)),this,SLOT(set_alway_on_top(int)));
    connect(bits,SIGNAL(value_changed()),this,SLOT(update_display()));
}

void BitOptions::change_width(){
    if (btn_8->isChecked()){
        bits->set_width(8);
    }
    else if(btn_16->isChecked()){
        bits->set_width(16);
    }
    else if(btn_32->isChecked()){
        bits->set_width(32);
    }
    else if(btn_64->isChecked()){
        bits->set_width(64);
    }
}

void BitOptions::update_display(){
    switch (bits->get_width()){
        case 8:
            btn_8->setChecked(true);
            break;
        case 16:
            btn_16->setChecked(true);
            break;
        case 32:
            btn_32->setChecked(true);
            break;
        case 64:
            btn_64->setChecked(true);
            break;
    }

}

void BitOptions::show_about_dialog(){
    about_dialog->exec();
}

void BitOptions::set_alway_on_top(int cke_state){
#ifdef Q_OS_WIN
    if (cke_state==Qt::Unchecked){
        SetWindowPos((HWND)this->parentWidget()->winId(),HWND_NOTOPMOST,this->parentWidget()->pos().x(),\
                     this->parentWidget()->pos().y(),this->parentWidget()->width(),this->parentWidget()->height(),SWP_SHOWWINDOW);
    }
    else{
        SetWindowPos((HWND)this->parentWidget()->winId(),HWND_TOPMOST,this->parentWidget()->pos().x(),\
                     this->parentWidget()->pos().y(),this->parentWidget()->width(),this->parentWidget()->height(),SWP_SHOWWINDOW);
    }
#endif
}
