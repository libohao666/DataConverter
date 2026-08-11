#-------------------------------------------------
#
# Project created by QtCreator 2018-05-27T01:59:24
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets
RC_ICONS = register.ico

TARGET = RegViewer
TEMPLATE = app

# The following define makes your compiler emit warnings if you use
# any feature of Qt which has been marked as deprecated (the exact warnings
# depend on your compiler). Please consult the documentation of the
# deprecated API in order to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

# You can also make your code fail to compile if you use deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0


SOURCES += \
        main.cpp \
    bits.cpp \
    bitbutton.cpp \
    bitbuttons.cpp \
    bitelement.cpp \
    bitlineedit.cpp \
    bitlineedits.cpp \
    bitoperate.cpp \
    bitoptions.cpp \
    common.cpp \
    reginfo.cpp \
    regdisplay.cpp \
    aboutdialog.cpp \
    third_part/cparse/builtin-features.cpp \
    third_part/cparse/containers.cpp \
    third_part/cparse/functions.cpp \
    third_part/cparse/packToken.cpp \
    third_part/cparse/shunting-yard.cpp \
    varsdisplay.cpp \
    lineeditfocus.cpp

HEADERS += \
    bits.h \
    bitbutton.h \
    bitbuttons.h \
    bitelement.h \
    bitlineedit.h \
    bitlineedits.h \
    bitoperate.h \
    bitoptions.h \
    common.h \
    regdisplay.h \
    reginfo.h \
    aboutdialog.h \
    third_part/cparse/builtin-features.inc \
    third_part/cparse/builtin-features/functions.inc \
    third_part/cparse/builtin-features/operations.inc \
    third_part/cparse/containers.h \
    third_part/cparse/functions.h \
    third_part/cparse/packToken.h \
    third_part/cparse/shunting-yard-exceptions.h \
    third_part/cparse/shunting-yard.h \
    varsdisplay.h \
    lineeditfocus.h

FORMS += \
    aboutdialog.ui


INCLUDEPATH += $$PWD/third_part/cparse
#DEPENDPATH += $$PWD/include

DISTFILES += \
    third_part/cparse/builtin-features/reservedWords.inc \
    third_part/cparse/builtin-features/typeSpecificFunctions.inc

