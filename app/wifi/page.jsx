"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";


const WIFI_DATA = [
    { id: '4KKERUJF', name: 'SPPG MEKARSARI, PAGELARAN #002', ssid24: 'SPPG2.4', pass24: 'Bh5H)LHL1j=.', ssid5: 'SPPG5', pass5: 'g<[o7\\+_r!,t' },
    { id: 'GHFBVHMX', name: 'SPPG BUNIWANGI, PAGELARAN', ssid24: 'SPPG2.4', pass24: '#[HR]FAx~4$W', ssid5: 'SPPG5', pass5: '5.n;Fqg_\'%v%' },
    { id: 'IMBCOECS', name: 'SPPG PARAKANTUGU, CIJATI #002', ssid24: 'SPPG2.4', pass24: 'zP1#4JQJn(su', ssid5: 'SPPG5', pass5: 'rvh8q,ozEa:v' },
    { id: 'OJODRKJD', name: 'SPPG GANDASARI, KADUPANDAK #001', ssid24: 'SPPG2.4', pass24: '}~etxjJq&/Pt', ssid5: 'SPPG5', pass5: '?4#I"&b6Fb(Z' },
    { id: 'QKDQMOZJ', name: 'SPPG CISALAK, CIDAUN #002', ssid24: 'SPPG2.4', pass24: '<~:h3/|JOA57', ssid5: 'SPPG5', pass5: '$KBJm]|L)HE|' },
    { id: 'TFEMIBDX', name: 'SPPG BOJONGKASO, AGRABINTA #003', ssid24: 'SPPG2.4', pass24: 'Xe+/}r\\ImZz)', ssid5: 'SPPG5', pass5: 'P(Ko^LQg^rv4' },
    { id: 'UE1863ZD', name: 'SPPG KERTASARI, SINDANGBARANG #001', ssid24: 'SPPG2.4', pass24: '|`Fc1Qv@2PXQ', ssid5: 'SPPG5', pass5: ',\'&@od`bfw`d' },
    { id: 'ZWCELHUA', name: 'SPPG PARAKANTUGU, CIJATI #001', ssid24: 'SPPG2.4', pass24: '_^zV:>p$L@{2', ssid5: 'SPPG5', pass5: 'Su2U@=5;)+o;' },
    { id: 'CD0DWLRE', name: 'SPPG CIBEUREUM, KERTASARI #001', ssid24: 'SPPG2.4', pass24: '7r/>r%0r^}E&', ssid5: 'SPPG5', pass5: '<jsug%n$n&M=' },
    { id: 'FNZVLWTK', name: 'SPPG CITAMAN, NAGREG #002', ssid24: 'SPPG2.4', pass24: '-i!Qhu^`IUX&', ssid5: 'SPPG5', pass5: 'XpS`OhVsrewd' },
    { id: '041BO44R', name: 'SPPG PAMULIHAN, PAMULIHAN #001', ssid24: 'SPPG2.4', pass24: 'eUA6Q|04W.J]', ssid5: 'SPPG5', pass5: '4V<2C-g)&<`&' },
    { id: '63FNBCSB', name: 'SPPG GUNUNG MANIK, TANJUNGSARI #001', ssid24: 'SPPG2.4', pass24: ']?&o~OGt31@3', ssid5: 'SPPG5', pass5: 'K0W_"a!o]uJW' },
    { id: '6XAODDWO', name: 'SPPG CIPAMEKAR, CONGGEANG', ssid24: 'SPPG2.4', pass24: '#&UH3xW_DH$C', ssid5: 'SPPG5', pass5: 'JdOxd+I/G)Z2' },
    { id: 'CMKCXRTU', name: 'SPPG JATIMEKAR, SITURAJA #001', ssid24: 'SPPG2.4', pass24: 'M|x~09cu2xhc', ssid5: 'SPPG5', pass5: 'C`3z2F\'DXJy1' },
    { id: 'EOEYIQMG', name: 'SPPG CIKAHURIPAN, CIMANGGUNG #002', ssid24: 'SPPG2.4', pass24: 'vZo[L7Y4Z=@J', ssid5: 'SPPG5', pass5: 'zX1gL-$hvZ&v' },
    { id: 'GUQJOUBJ', name: 'SPPG SUKASARI, SUKASARI #003', ssid24: 'SPPG2.4', pass24: 'qvCh|gR5^ffN', ssid5: 'SPPG5', pass5: '"2ZZ~"Bu@&Y>' },
    { id: 'H0MXG5VW', name: 'SPPG MARGAMUKTI, SUMEDANG UTARA #001', ssid24: 'SPPG2.4', pass24: 'Y,g,{S-CLt87', ssid5: 'SPPG5', pass5: '[\\n\\PIFu`B3k' },
    { id: 'HAER7EHT', name: 'SPPG SUKAJAYA, SUMEDANG SELATAN #001', ssid24: 'SPPG2.4', pass24: 'sd6Cc@Hah8vr', ssid5: 'SPPG5', pass5: 'DY\'{uu[!ls}/' },
    { id: 'IVHWGER2', name: 'SPPG KEBONKALAPA, CISARUA #002', ssid24: 'SPPG2.4', pass24: 'Q==2h2LJ=3pb', ssid5: 'SPPG5', pass5: 'T-"!i_g7VY>%' },
    { id: 'JSYMCKDC', name: 'SPPG PASIGARAN, TANJUNGSARI #001', ssid24: 'SPPG2.4', pass24: '9FDB|@{JWfj[', ssid5: 'SPPG5', pass5: 'R:&H0p|##42w' },
    { id: 'JVYEGJQW', name: 'SPPG CIKERUH, JATINANGOR #004', ssid24: 'SPPG2.4', pass24: '[.Ih?\\\\msSsi', ssid5: 'SPPG5', pass5: 'YUC+R2k,2]Sn' },
    { id: 'KDD1T5CU', name: 'SPPG MANDALAHERANG, CIMALAKA', ssid24: 'SPPG2.4', pass24: '5V3fP3QlB6^Q', ssid5: 'SPPG5', pass5: 'VuvVy=,<w}I>' },
    { id: 'KGU5FXKX', name: 'SPPG PASEH KIDUL, PASEH #001', ssid24: 'SPPG2.4', pass24: 'BjVLXrB\\(!8[', ssid5: 'SPPG5', pass5: 'X)$-E$JR6r!_' },
    { id: 'L08LIJBX', name: 'SPPG CIPTASARI, PAMULIHAN #002', ssid24: 'SPPG2.4', pass24: 'mjd{Y\'f.?l"g', ssid5: 'SPPG5', pass5: 'HsOD?=?8Uj*.' },
    { id: 'L6AWVMMS', name: 'SPPG CIPANAS, TANJUNGKERTA #001', ssid24: 'SPPG2.4', pass24: '3~V<Oii}ej7i', ssid5: 'SPPG5', pass5: '"Th}QbdPbCgo' },
    { id: 'L7R5VUHP', name: 'SPPG CIMALAKA, CIMALAKA #002', ssid24: 'SPPG2.4', pass24: 'hEPOvPY<4#(e', ssid5: 'SPPG5', pass5: '`rE^^%N]1!?N' },
    { id: 'M0K6JVMX', name: 'SPPG CIMUJA, CIMALAKA #003', ssid24: 'SPPG2.4', pass24: 'w@|DIeWe~3yM', ssid5: 'SPPG5', pass5: '#QOeCIzPV\'E>' },
    { id: 'NFXLDUQX', name: 'SPPG HEGARMANAH, JATINANGOR #007', ssid24: 'SPPG2.4', pass24: 'I!fKx+)4fuwZ', ssid5: 'SPPG5', pass5: 'MA0us}R35EO5' },
    { id: 'NUL66RYO', name: 'SPPG GUDANG, TANJUNGSARI #002', ssid24: 'SPPG2.4', pass24: 'tAQCNj{\'`vlM', ssid5: 'SPPG5', pass5: 'P{*JZ0T#4sZr' },
    { id: 'SKF6SHOA', name: 'SPPG SINDANGGALIH, CIMANGGUNG #001', ssid24: 'SPPG2.4', pass24: '&HbIV)%-k{#.', ssid5: 'SPPG5', pass5: ']&4MuW&bFJRY' },
    { id: 'VEJCEXO3', name: 'SPPG CINANJUNG, TANJUNGSARI #003', ssid24: 'SPPG2.4', pass24: 'QLxZFp(g3vUm', ssid5: 'SPPG5', pass5: 'LWMe<XXyE&gy' },
    { id: 'WX7AKUPM', name: 'SPPG SAYANG, JATINANGOR #001', ssid24: 'SPPG2.4', pass24: 'lb=IH"+0u~P+', ssid5: 'SPPG5', pass5: '%~IKF@Zkbj#0' },
    { id: 'ZIDW5XJV', name: 'SPPG NYALINDUNG, CIMALAKA #001', ssid24: 'SPPG2.4', pass24: ')DA!k,/*rJw\\', ssid5: 'SPPG5', pass5: ']%dk1\\8^-oc^' },
    { id: 'ZYATPGVU', name: 'SPPG KOTA KULON , SUMEDANG SELATAN #005', ssid24: 'SPPG2.4', pass24: 'a);-*)"qE=1S', ssid5: 'SPPG5', pass5: 'W>gA`pedbPrR' },
    { id: 'JMQECX10', name: 'SPPG CIROYOM, CIPEUNDEUY #002', ssid24: 'SPPG2.4', pass24: '<g:09i<ZmvNF', ssid5: 'SPPG5', pass5: 'W;5Bhl+Iq-"|' },
    { id: '8EIPOYSH', name: 'SPPG CIBEUREUM, KERTASARI #003', ssid24: 'SPPG2.4', pass24: ');~_R!lKGB}c', ssid5: 'SPPG5', pass5: 'LJQW:rHl{HO8' },
    { id: '8UDN0AK8', name: 'SPPG NAGRAK, PACET #004', ssid24: 'SPPG2.4', pass24: 'eUv5@FI<UTd\'', ssid5: 'SPPG5', pass5: 'iO)yms~A-\\f%' },
    { id: 'AIZW0K6T', name: 'SPPG CILAMPENI, KATAPANG #003', ssid24: 'SPPG2.4', pass24: 'J]V~b?]hZf!5', ssid5: 'SPPG5', pass5: 'E>%o_c~+5Yz~' },
    { id: 'BI0ZZT18', name: 'SPPG ANTAPANI KIDUL, ANTAPANI #002', ssid24: 'SPPG2.4', pass24: 'L`Ldl^A{}[db', ssid5: 'SPPG5', pass5: 'vgsMUGW`w$>X' },
    { id: 'C2DXAO4K', name: 'SPPG PANENJOAN, CICALENGKA #004', ssid24: 'SPPG2.4', pass24: '\\,.P{\'K\\?qSb', ssid5: 'SPPG5', pass5: 'krBIBsQu2Kg"' },
    { id: 'FTN2GQPA', name: 'SPPG PANYOCOKAN, CIWIDEY #001', ssid24: 'SPPG2.4', pass24: '@p>nYSp2?|W)', ssid5: 'SPPG5', pass5: '`57V5)1;P*rD' },
    { id: 'OXLXLGG3', name: 'SPPG BANYUSARI, KATAPANG #001', ssid24: 'SPPG2.4', pass24: 'W2gM(:<w&iS?', ssid5: 'SPPG5', pass5: 'FpWh:,?hU7PC' },
    { id: 'XL4BIXT0', name: 'SPPG JAGABAYA, CIMAUNG #003', ssid24: 'SPPG2.4', pass24: 'M\\|Af.R>__=j', ssid5: 'SPPG5', pass5: 'fvFb/K^Y\\OXm' },
    { id: 'Z7ZCFLOW', name: 'SPPG SADU, SOREANG #001', ssid24: 'SPPG2.4', pass24: '@MBcC,-BZ7r%', ssid5: 'SPPG5', pass5: '&\\Vnn9lGWbFW' },
    { id: '0SGL5NCE', name: 'SPPG CIHARASHAS, CIPEUNDEUY #001', ssid24: 'SPPG2.4', pass24: '7E41PA#w"!F3', ssid5: 'SPPG5', pass5: '!aJeSWtwK2PF' },
    { id: '20VFRBIL', name: 'SPPG CITAPEN, CIHAMPELAS #002', ssid24: 'SPPG2.4', pass24: '}ZDr4%&5k6=T', ssid5: 'SPPG5', pass5: 'ZJF2xH=-=?0M' },
    { id: '2AXBERIV', name: 'SPPG PUTERAN, CIKALONGWETAN #003', ssid24: 'SPPG2.4', pass24: '0)+|wsM)S:i]', ssid5: 'SPPG5', pass5: 'K%N}JZcZ3L;{' },
    { id: 'AJ9ODVFZ', name: 'SPPG CIHAMPELAS, CIHAMPELAS #002', ssid24: 'SPPG2.4', pass24: 'y*@4#!nP7xVA', ssid5: 'SPPG5', pass5: 'SK/WCn<=jXu5' },
    { id: 'G4QSBHHM', name: 'SPPG JAMBUDIPA, CISARUA #002', ssid24: 'SPPG2.4', pass24: 'Aa^<E>8N.oMj', ssid5: 'SPPG5', pass5: '.2-Nm)@qLlM0' },
    { id: 'GMDIFXH1', name: 'SPPG CINENGAH, RONGGA #002', ssid24: 'SPPG2.4', pass24: ':`Ys8D@-vm0,', ssid5: 'SPPG5', pass5: '9(AlbOXT.M`\\' },
    { id: 'TVJKS7GX', name: 'SPPG BUDIHARJA, CILILIN', ssid24: 'SPPG2.4', pass24: 'WpXPW?sJR^PJ', ssid5: 'SPPG5', pass5: ':GOcpTl}}/%`' },
    { id: 'V0ZNBOAJ', name: 'SPPG CIPEUNDEUY, CIPEUNDEUY #002', ssid24: 'SPPG2.4', pass24: 'cmypQ;t]x{yE', ssid5: 'SPPG5', pass5: 'V%?ubyk]5>Pu' },
    { id: 'YQ7KTGX5', name: 'SPPG SIRNAJAYA, GUNUNGHALU #005', ssid24: 'SPPG2.4', pass24: 'ig7`>o\'Bh-#*', ssid5: 'SPPG5', pass5: 'NMk3y]^f/\'?a' },
    { id: 'APNIT5JR', name: 'SPPG SIRNAGALIH, SINDANGBARANG #001', ssid24: 'SPPG2.4', pass24: 'mD\'OO`Ive8:T', ssid5: 'SPPG5', pass5: 'H/liMx}/~Eb2' },
    { id: 'CC5SYHQU', name: 'SPPG SUKAJADI, CAMPAKA #003', ssid24: 'SPPG2.4', pass24: 'k]v"|*G#CHf;', ssid5: 'SPPG5', pass5: ':+p"T=cEY4jr' },
    { id: 'FKJ1FXRP', name: 'SPPG SUKANAGALIH, PACET #003', ssid24: 'SPPG2.4', pass24: 'L-^aNOv_LI1A', ssid5: 'SPPG5', pass5: '1z$fV5I4G\'9m' },
    { id: 'UGDDUUHI', name: 'SPPG CIBADAK, SUKARESMI #001', ssid24: 'SPPG2.4', pass24: '(ESrKqjs;bY]', ssid5: 'SPPG5', pass5: 'zcqX=u9E|&SF' },
    { id: 'EEVUVD11', name: 'SPPG GANEAS, GANEAS #001', ssid24: 'SPPG2.4', pass24: 'bYh1z@7Zu|oD', ssid5: 'SPPG5', pass5: ']+%h"yXzQFuO' },
    { id: 'EEWPSKAL', name: 'SPPG TARIKOLOT, JATINUNGGAL #003', ssid24: 'SPPG2.4', pass24: 'u97R),;\'f.B\\', ssid5: 'SPPG5', pass5: 'FQAmprN0a@</' },
    { id: 'OHES6MDW', name: 'SPPG CIJATI, SITURAJA #004', ssid24: 'SPPG2.4', pass24: '_3BNQTuSh-9}', ssid5: 'SPPG5', pass5: 'YUh%k{TD$c)s' },
    { id: 'TYVPH9WF', name: 'SPPG TOLENGAS, TOMO', ssid24: 'SPPG2.4', pass24: '?*S<L$lBIP>B', ssid5: 'SPPG5', pass5: '@.95?=j{bO7*' },
    { id: 'WVBZF10M', name: 'SPPG KOTA KALER , SUMEDANG UTARA #004', ssid24: 'SPPG2.4', pass24: 'X,*n-b,xKzW(', ssid5: 'SPPG5', pass5: '](y-0mY/g{Aq' },
    { id: 'UPX1QJ0R', name: 'SPPG CIMEKAR, CILEUNYI #012', ssid24: 'SPPG2.4', pass24: 'W>B!GC`$zKC>', ssid5: 'SPPG5', pass5: '99eAeSflKt3c' },
    { id: 'KUJUHWP7', name: 'SPPG SUKAJADI, CAMPAKA #005', ssid24: 'SPPG2.4', pass24: 'kNpG$hK#Ff_A', ssid5: 'SPPG5', pass5: '!zO]4o?G=<z$' },
    { id: '3PHMYTGK', name: 'SPPG LEMBAHSARI, CIKALONGKULON', ssid24: 'SPPG2.4', pass24: 'W`.k<Bp8^OLt', ssid5: 'SPPG5', pass5: '_Djhz+5\\:_Tf' },
    { id: 'TUEKPVJS', name: 'SPPG MEKARJAYA, CIKALONGKULON #002', ssid24: 'SPPG2.4', pass24: '0?Z{~W9H2w7^', ssid5: 'SPPG5', pass5: 's4[Npmk5z1\\Z' },
    { id: 'EI4QI8IY', name: 'SPPG PALASARI, CIPANAS #003', ssid24: 'SPPG2.4', pass24: '"<6A{V!6[58<', ssid5: 'SPPG5', pass5: '?/9FsU\'[QPFy' },
    { id: 'FTUFDHVT', name: 'SPPG PALASARI, CIPANAS #006', ssid24: 'SPPG2.4', pass24: '7e=a*TL)~|RE', ssid5: 'SPPG5', pass5: 'r)#U02~{.prF' },
    { id: 'VAPGMOHC', name: 'SPPG PADAULUN, MAJALAYA #001', ssid24: 'SPPG2.4', pass24: 'r!j8VN]N}Cu#', ssid5: 'SPPG5', pass5: 'YNCMy`C-3g*{' },
    { id: 'OKED1M2I', name: 'SPPG TENJOLAYA, CICALENGKA #004', ssid24: 'SPPG2.4', pass24: 'VSeJBOQAS!e\\', ssid5: 'SPPG5', pass5: 'KAlK&nL7(CTr' },
    { id: 'MWVMQCCW', name: 'SPPG CILEUNYI KULON, CILEUNYI #004', ssid24: 'SPPG2.4', pass24: '$kqt?f@"!Y{h', ssid5: 'SPPG5', pass5: 'ApgSk#*A82CT' },
    { id: 'QWD4WZCD', name: 'SPPG CIBEUREUM, KERTASARI #002', ssid24: 'SPPG2.4', pass24: '(Y)_A:%6lD24', ssid5: 'SPPG5', pass5: '|,T{d*n@#[j`' },
    { id: '0VBU0TIN', name: 'SPPG TANJUNGSARI, TANJUNGSARI #001', ssid24: 'SPPG2.4', pass24: '|lXwg9~t`2@g', ssid5: 'SPPG5', pass5: "KM$p'h`lO@?a" },
    { id: '1SKCJXMV', name: 'SPPG CIGENDEL, PAMULIHAN #001', ssid24: 'SPPG2.4', pass24: '1p,[sUhWCU,)', ssid5: 'SPPG5', pass5: "oc5`I*\\^$0mE" },
    { id: '2RTSDLVC', name: 'SPPG JATISARI, TANJUNGSARI', ssid24: 'SPPG2.4', pass24: 'XHmYL08FeFk|', ssid5: 'SPPG5', pass5: "J4YIz0fFV,mZ" },
    { id: 'AMPYRLXW', name: 'SPPG TANJUNGSARI, TANJUNGSARI #003', ssid24: 'SPPG2.4', pass24: 'rn*F`MdZ+O`s', ssid5: 'SPPG5', pass5: "4\\7;5^e!4mVT" },
    { id: 'AYVSGOPN', name: 'SPPG KOTA KULON , SUMEDANG SELATAN #006', ssid24: 'SPPG2.4', pass24: 'F0]iqDjRGtI^', ssid5: 'SPPG5', pass5: "pP8-Xac0T`:\\" },
    { id: 'C4RGIIVS', name: 'SPPG KOTA KULON , SUMEDANG SELATAN #004', ssid24: 'SPPG2.4', pass24: 'CJ=E^a(_JyuK', ssid5: 'SPPG5', pass5: ".C`4['/FNSzr" },
    { id: 'WRENAJKQ', name: 'SPPG REGOL WETAN , SUMEDANG SELATAN #002', ssid24: 'SPPG2.4', pass24: '_=?W6z;0$Rd&', ssid5: 'SPPG5', pass5: "w/M<jle{j8UC" },
    { id: '0DIWMHSR', name: 'SPPG BALEENDAH, BALEENDAH #004', ssid24: 'SPPG2.4', pass24: '/rE5[/>_NCV\\', ssid5: 'SPPG5', pass5: "n)+,=J]gK{]c" },
    { id: 'F0QM3R4Z', name: 'SPPG MARGAHAYU TENGAH, MARGAHAYU #002', ssid24: 'SPPG2.4', pass24: '#+db<;*Gii?8', ssid5: 'SPPG5', pass5: "njVuTkW)hIc\\" },
    { id: 'FGU9DGPK', name: 'SPPG CIMEKAR, CILEUNYI #005', ssid24: 'SPPG2.4', pass24: 'p}@xmclf-Ah+', ssid5: 'SPPG5', pass5: '17;tp1venC"f' },
    { id: 'PW2MMKIH', name: 'SPPG TEGALLUAR, BOJONGSOANG #003', ssid24: 'SPPG2.4', pass24: 'i@#u1EowDn8F', ssid5: 'SPPG5', pass5: 'Agh;"H.~fsx5' },
    { id: 'TASFYMK9', name: 'SPPG MANGGAHANG, BALEENDAH #006', ssid24: 'SPPG2.4', pass24: '2UjQ$`%$udv&', ssid5: 'SPPG5', pass5: 'DE\\8{cEoqz#}' },
    { id: 'XLL7NNVI', name: 'SPPG BALEENDAH, BALEENDAH #002', ssid24: 'SPPG2.4', pass24: '\\Kn+D97<1b)4', ssid5: 'SPPG5', pass5: '9pGHo]7[|ZN4' },
    { id: '84NR2GMP', name: 'SPPG SARIWANGI, PARONGPONG #003', ssid24: 'SPPG2.4', pass24: '5q>MKR@LJgMh', ssid5: 'SPPG5', pass5: "~d'kNVV?&CX$" },
    { id: 'BYTA4PDP', name: 'SPPG CIHANJUANG, PARONGPONG #006', ssid24: 'SPPG2.4', pass24: '4IScTUq/7mZN', ssid5: 'SPPG5', pass5: 'Mm>i"dejAz&[' },
    { id: 'XFZ8EUZA', name: 'SPPG CIBURUY, PADALARANG #006', ssid24: 'SPPG2.4', pass24: 'm~c1EOD`+5TY', ssid5: 'SPPG5', pass5: "6k|1e1a&`kKn" },
    { id: 'C2L2Z1KJ', name: 'SPPG RANCAGOONG, CILAKU #005', ssid24: 'SPPG2.4', pass24: 'xVr)[z-J;lH~', ssid5: 'SPPG5', pass5: "w/9(zE?[b@`S" },
    { id: 'DAFPPEWF', name: 'SPPG SUKASARI, CILAKU #001', ssid24: 'SPPG2.4', pass24: 'iUQaaSLF.lk!', ssid5: 'SPPG5', pass5: "^\\L.XB'sFsAy" },
    { id: 'OEGWG45L', name: 'SPPG HEGARMANAH, KARANGTENGAH #005', ssid24: 'SPPG2.4', pass24: 'aiHyC?`MFc\\4', ssid5: 'SPPG5', pass5: "UEjncAS4=YG`" },
    { id: 'SYQIVA8T', name: 'SPPG SINDANGLAKA, KARANGTENGAH #002', ssid24: 'SPPG2.4', pass24: 'U4b07$|Tpahn', ssid5: 'SPPG5', pass5: "?XT19=mu4](1" },
    { id: 'T9RDWCOX', name: 'SPPG CIKAROYA, WARUNGKONDANG #002', ssid24: 'SPPG2.4', pass24: 'g_96p;9**{Lf', ssid5: 'SPPG5', pass5: "Tvq<^;M_7m~S" },
    { id: 'VRKZNDMU', name: 'SPPG SAYANG, CIANJUR #002', ssid24: 'SPPG2.4', pass24: 'c|(+`DxvCf:e', ssid5: 'SPPG5', pass5: "4:.p|O<9EEzL" },
    { id: 'WSFAOCOR', name: 'SPPG CIRANJANG, CIRANJANG #001', ssid24: 'SPPG2.4', pass24: '8TusW_),bXSO', ssid5: 'SPPG5', pass5: "N*qnD@u<^Q|^" },
    { id: 'KSCSP3S1', name: 'SPPG CIBADUYUT, BOJONGLOA KIDUL #001', ssid24: 'SPPG2.4', pass24: '$f1Q+?SVcS@J', ssid5: 'SPPG5', pass5: "j?Y@!9Nh}{a^" },
    { id: 'OAS1GTBV', name: 'SPPG BABAKAN, BABAKAN CIPARAY #003', ssid24: 'SPPG2.4', pass24: '%8[05&5TdPTY', ssid5: 'SPPG5', pass5: "Vvm<*#RQE8)I" },
    { id: 'Q4O2IBYA', name: 'SPPG PASIR ENDAH, UJUNGBERUNG #001', ssid24: 'SPPG2.4', pass24: 'Q!:;_t/K8>cB', ssid5: 'SPPG5', pass5: "rl]:L'(-]W(]" },
    { id: '3KRF6DCY', name: 'SPPG CIBEUREUM, CIMAHI SELATAN #004', ssid24: 'SPPG2.4', pass24: "sEs~[>Bf'X|c", ssid5: 'SPPG5', pass5: "t\\fueJLN/~=q" },
    { id: 'BX2W9CT0', name: 'SPPG PADASUKA, CIMAHI TENGAH #002', ssid24: 'SPPG2.4', pass24: '|[;n_<*0W-20', ssid5: 'SPPG5', pass5: "3C1Yz2MFz25;" },
    { id: 'VYN0OBL1', name: 'SPPG CITEUREUP, CIMAHI UTARA #005', ssid24: 'SPPG2.4', pass24: ';UxUbz!uX|4H', ssid5: 'SPPG5', pass5: "S'F}K^&.fur}" },
    { id: 'ZEZ3TM0G', name: 'SPPG PALABUAN, UJUNGJAYA', ssid24: 'SPPG2.4', pass24: 'dr(H2<-28_mW', ssid5: 'SPPG5', pass5: "WBwwj-\\Qp*|3" },
    { id: 'ZTQ8DKK8', name: 'SPPG NAGARAWANGI, RANCAKALONG #002', ssid24: 'SPPG2.4', pass24: 'Wuc$$Sr=/Q):', ssid5: 'SPPG5', pass5: "Fr<'2{ECVv1@" },
    { id: 'DLQ1XX22', name: 'SPPG SUKASARI, CILAKU #002', ssid24: 'SPPG2.4', pass24: '6xp`q$+/n6x(', ssid5: 'SPPG5', pass5: "[DMm^>~DQVW|" },
    { id: 'PC6X27S5', name: 'SPPG SIRNAGALIH, CILAKU #008', ssid24: 'SPPG2.4', pass24: 'T%3R6i<&FT.l', ssid5: 'SPPG5', pass5: "a3\\Xh7`*cG(C" },
    { id: 'VYNFSIGN', name: 'SPPG BALEENDAH, BALEENDAH #017', ssid24: 'SPPG2.4', pass24: '7+N^O}bM-Hsu', ssid5: 'SPPG5', pass5: "ba1.2?w'ju|w" },
    { id: 'EBVANYKY', name: 'SPPG CIAPUS, BANJARAN #002', ssid24: 'SPPG2.4', pass24: 'K|FxO"7MRS$c', ssid5: 'SPPG5', pass5: "dzX1jpN9^An\\" },
    { id: 'PFH9QN5J', name: 'SPPG BOJONG, MAJALAYA', ssid24: 'SPPG2.4', pass24: 'v8#"q161_G"2', ssid5: 'SPPG5', pass5: "7Nc\\^:)O5tT1" },
];

export default function WiFiPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedField, setCopiedField] = useState('');

    // Authentication check
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const filteredData = WIFI_DATA.filter(item =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(''), 2000);
    };

    return (
        <div className="container">
            <header className="header">
                 <div onClick={() => router.push('/')} style={{ cursor: 'pointer', marginBottom: '20px', display: 'inline-flex', background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1d1d1f' }}>
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </div>
                <div className="logo-container">
                    <img src="/baraya_logo.png" className="logo-img" alt="Logo" />
                </div>
                <h1 className="title">WiFi SPPG</h1>
                <p className="subtitle">SPPG Bandung Raya</p>
            </header>

            <div className="card" style={{ display: 'block' }}>
                <h3 className="label" style={{ marginBottom: '12px' }}>Cari WiFi SPPG</h3>
                <input
                    className="input-field"
                    placeholder="🔍 Ketik ID atau Nama SPPG..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            <div style={{ marginTop: '20px', paddingBottom: '120px' }}>
                {searchQuery.trim() === '' ? (
                   <div style={{ textAlign: 'center', padding: '40px 20px', color: '#86868b' }}>
                        <div style={{ fontSize: '42px', marginBottom: '10px', opacity: 0.5 }}>📡</div>
                        <p style={{ fontWeight: 600 }}>Cari WiFi SPPG</p>
                        <p style={{ fontSize: '13px' }}>Ketik ID atau Nama SPPG di kolom pencarian</p>
                    </div>
                ) : (
                    <>
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', padding: '0 8px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Hasil Pencarian</h3>
                            <span style={{ fontSize: '13px', color: '#86868b', background: '#e5e5ea', padding: '4px 8px', borderRadius: '8px' }}>{filteredData.length} lokasi</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredData.map(item => (
                                <div key={item.id} className="card" style={{ display: 'block', padding: '24px' }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#86868b', background: '#f5f5f7', padding: '4px 8px', borderRadius: '6px' }}>{item.id}</span>
                                        <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginTop: '8px', lineHeight: 1.4 }}>{item.name}</h3>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {/* 2.4GHz Section */}
                                        <div style={{ background: '#f5f5f7', borderRadius: '12px', padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#0071e3', fontSize: '13px', fontWeight: 600 }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                                                WiFi 2.4 GHz
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#86868b' }}>SSID</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 500 }}>{item.ssid24}</span>
                                                    <button onClick={() => copyToClipboard(item.ssid24, `${item.id}-ssid24`)} style={{ border: 'none', background: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '13px' }}>
                                                        {copiedField === `${item.id}-ssid24` ? '✓' : 'Copy'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#86868b' }}>Password</div>
                                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <code style={{ fontFamily: 'monospace', background: '#e5e5ea', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>{item.pass24}</code>
                                                    <button onClick={() => copyToClipboard(item.pass24, `${item.id}-pass24`)} style={{ border: 'none', background: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '13px' }}>
                                                        {copiedField === `${item.id}-pass24` ? '✓' : 'Copy'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 5GHz Section */}
                                        <div style={{ background: '#f5f5f7', borderRadius: '12px', padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#34c759', fontSize: '13px', fontWeight: 600 }}>
                                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                                                WiFi 5 GHz
                                            </div>
                                            <div style={{ marginBottom: '8px' }}>
                                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#86868b' }}>SSID</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 500 }}>{item.ssid5}</span>
                                                    <button onClick={() => copyToClipboard(item.ssid5, `${item.id}-ssid5`)} style={{ border: 'none', background: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '13px' }}>
                                                        {copiedField === `${item.id}-ssid5` ? '✓' : 'Copy'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#86868b' }}>Password</div>
                                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <code style={{ fontFamily: 'monospace', background: '#e5e5ea', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>{item.pass5}</code>
                                                    <button onClick={() => copyToClipboard(item.pass5, `${item.id}-pass5`)} style={{ border: 'none', background: 'none', color: '#0071e3', cursor: 'pointer', fontSize: '13px' }}>
                                                        {copiedField === `${item.id}-pass5` ? '✓' : 'Copy'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                         {filteredData.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>
                                Tidak ada data ditemukan
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Floating Dock Navigation */}
            <div className="dock-container">
                <button className="dock-icon" onClick={() => router.push('/')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Home</span>
                </button>
                <button className="dock-icon" onClick={() => router.push('/inventory')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>Material</span>
                </button>
                <button className="dock-icon" onClick={() => router.push('/mos')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>MOS</span>
                </button>
                <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)', alignSelf: 'center' }}></div>
                <button className="dock-icon active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                    <span>WiFi</span>
                </button>
                <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)', alignSelf: 'center' }}></div>
                <button className="dock-icon" onClick={() => router.push('/bast')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    <span>BAST</span>
                </button>
            </div>
        </div>
    );
}
