#include "aboutdialog.h"
#include "ui_aboutdialog.h"
#include <QDesktopServices>
#include "common.h"

AboutDialog::AboutDialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::AboutDialog)
{
    ui->setupUi(this);
    ui->textBrowser->setOpenLinks(false);
    connect(ui->textBrowser, SIGNAL(anchorClicked(const QUrl&)),this, SLOT(click_url_link(const QUrl&)));
    connect(ui->buttonBox, SIGNAL(helpRequested()), this, SLOT(help_click()));
}

AboutDialog::~AboutDialog()
{
    delete ui;
}

void AboutDialog::click_url_link(const QUrl &url){
    QDesktopServices::openUrl(url);
}

void AboutDialog::help_click(){
    QDesktopServices::openUrl(QUrl(HELP_FILE));
}
