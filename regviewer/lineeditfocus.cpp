#include "lineeditfocus.h"

LineEditFocus::LineEditFocus(QWidget *parent):QLineEdit(parent)
{

}

void LineEditFocus::focusInEvent(QFocusEvent *e)
{
    QLineEdit::focusInEvent(e);
    emit getFocus();
}

void LineEditFocus::focusOutEvent(QFocusEvent *e)
{
    QLineEdit::focusOutEvent(e);
    emit lostFocus();
}
