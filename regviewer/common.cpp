#include "common.h"
#include <QString>
#include <QStringList>
#include <vector>
#include <ctype.h>
#include <QDebug>
#include <bits.h>

 /*	e.g. "0x10+100" --> "16+100"
  */
QString convert_hex_in_str(QString input_str){
    QString output_str;
    QStringList output_list;
    int index,index_0x;
    index = 0;
    input_str = input_str.toLower();
    index_0x = input_str.indexOf("0x");
    while ( index_0x != -1){
        if (index_0x != 0){
            output_list.append(input_str.mid(index,index_0x-index));
        }
        index = index_0x + 2;
        while (isxdigit(input_str[index].cell())){
            index ++;
        }
        output_list.append(input_str.mid(index_0x,index-index_0x));
        index_0x = input_str.indexOf("0x",index);
    }
    output_list.append(input_str.mid(index));
    //qDebug() << output_list ;

    for (int i = 0; i < output_list.size(); ++i){
        if (output_list.at(i).left(2)=="0x"){
            Bits bits(64);
            bits.set_hex_string(output_list.at(i).toStdString());
            output_str += QString::fromStdString(bits.get_dec_signed_string());
        }
        else{
            output_str += output_list.at(i);
        }
    }
    //qDebug() << output_str ;
    return output_str;
}

 /* left_expr = (((d.l(spr:0x36520))&0xFD000000)==
 * right_expr_list = 0x90000000 0x94000000
 * */

QString merge_left_right(QString left_expr, QStringList right_expr_list){
    QString result;
    for (int i=0; i< right_expr_list.size(); i++){
        result += left_expr + right_expr_list[i] + ")||";
    }
    return result.left(result.size()-2); //remove last "||"
}

/* such as: (0x90000000||0x94000000))
 * to: 0x90000000 0x940000000
 * */
QStringList unfold_right(QString input_str){
    qDebug() << "unfold right:" << input_str;
    QStringList result;
    QString pattern_1("(0x[0-9a-fA-F]+)");
    QRegExp rx(pattern_1);
    int pos = 0;
    while ((pos = rx.indexIn(input_str, pos)) != -1){
        result << rx.cap(1);
        pos += rx.matchedLength();
    }
    qDebug() << "unfold result:" << result;
    return result;
}

/*
 * such as: (((d.l(spr:0x36520))&0xFD000000)==(0x90000000||0x94000000))
 * to 0x90000000)||(((d.l(spr:0x36520))&0xFD000000)==0x94000000)
 * left_expr = (((d.l(spr:0x36520))&0xFD000000)==
 * right_expr_list = 0x90000000 0x94000000
 * */
QString unfold_expression(QString input_str){
        QString left_expr;
        QStringList right_expr_list;
        int index;
        if (input_str.contains("==(")){
            index = input_str.indexOf("==(");
            left_expr=input_str.left(index+2);
            right_expr_list = unfold_right(input_str.right(input_str.size()-index-2));
            qDebug() << "Left expr:" << left_expr;
            qDebug() << "Right expr:" << right_expr_list;
            return merge_left_right(left_expr,right_expr_list);
        }
        else{
            return input_str;
        }

}
