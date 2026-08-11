#ifndef LINEEDITFOCUS_H
#define LINEEDITFOCUS_H
#include <QLineEdit>

class LineEditFocus : public QLineEdit
{
    Q_OBJECT
public:
    LineEditFocus(QWidget *parent = nullptr);
protected:
      virtual void focusInEvent(QFocusEvent *e);
      virtual void focusOutEvent(QFocusEvent *e);
signals:
    void getFocus();
    void lostFocus();
};

#endif // LINEEDITFOCUS_H
