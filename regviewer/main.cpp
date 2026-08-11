#include <QApplication>
#include <bitelement.h>
#include <QStyleFactory>
#include <QDebug>
#include "common.h"
#include "QFontDatabase"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    QApplication::setStyle(QStyleFactory::create("fusion"));
//    QFont font;
//    font.setPointSize(10);
//    font.setFamily("courier");
//    a.setFont(font);

    int fontId = QFontDatabase::addApplicationFont(FONT_FILE);
    QString msyh = QFontDatabase::applicationFontFamilies ( fontId ).at(0);
    QFont font(msyh,10);
    QApplication::setFont(font);

    //QApplication::setStyle(QStyleFactory::create("WindowsVista"));
    BitElement bit_element;
    bit_element.show();
    bit_element.setFixedSize(bit_element.width(),bit_element.height());
    return a.exec();
}
