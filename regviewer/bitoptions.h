#ifndef BITOPTIONS_H
#define BITOPTIONS_H

#include <QWidget>
#include "bits.h"
#include <QRadioButton>
#include <QCheckBox>
#include <QPushButton>
#include "aboutdialog.h"

#ifdef Q_OS_WIN
#include <windows.h>
#endif

class BitOptions : public QWidget
{
    Q_OBJECT
public:
    explicit BitOptions(QWidget *parent, Bits * bits);

signals:

private:
    Bits * bits;
    QRadioButton * btn_8;
    QRadioButton * btn_16;
    QRadioButton * btn_32;
    QRadioButton * btn_64;
    QCheckBox * ckbox_always_on_top;
    QPushButton * btn_about;
    AboutDialog * about_dialog;

public slots:
    void set_alway_on_top(int);
    void change_width();
    void update_display();
    void show_about_dialog();
};

#endif // BITOPTIONS_H
