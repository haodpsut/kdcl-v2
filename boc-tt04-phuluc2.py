# -*- coding: utf-8 -*-
"""Boc Phu luc II cua Thong tu 04/2025 thanh JSON: yeu cau + minh chung goi y cho tung tieu chi."""
import re, json, sys, io, unicodedata

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

NGUON = ['../new/tt04-kdcl-p061-090.md', '../new/tt04-kdcl-p091-115.md']  # bản phiên âm scan thông tư
MOC = 'HƯỚNG DẪN ĐÁNH GIÁ CHẤT LƯỢNG CHƯƠNG TRÌNH ĐÀO TẠO'


def don_o(s):
    """Bo dau **/***/nhan mac, doi <br> thanh xuong dong, gop khoang trang."""
    s = s.replace('<br>', '\n')
    s = re.sub(r'\*+', '', s)
    s = re.sub(r'\[\^\d+\]', '', s)
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()


def tach_muc(o, kieu):
    """Tach o thanh danh sach muc. kieu='so' -> '1. ...'; kieu='gach' -> '- ...'."""
    o = don_o(o)
    o = re.sub(r'\(tiếp trang sau\)', '', o)
    o = re.sub(r'\(tiếp theo\)', '', o)
    if kieu == 'so':
        phan = re.split(r'(?m)^\s*(?=\d{1,2}[\.\)]\s)', o)
    else:
        phan = re.split(r'(?m)^\s*(?=[-–—•]\s)', o)
    ra = []
    for p in phan:
        p = p.strip()
        if not p:
            continue
        p = re.sub(r'^\d{1,2}[\.\)]\s*', '', p)
        p = re.sub(r'^[-–—•]\s*', '', p)
        p = re.sub(r'\s*\n\s*', ' ', p)
        p = re.sub(r'\s{2,}', ' ', p).strip().rstrip(';')
        if len(p) < 8:
            continue
        ra.append(p)
    return ra


def gon(s):
    """Chuan hoa de so sanh: bo dau nhan, gop khoang trang, ha chu thuong."""
    return re.sub(r'\s+', ' ', re.sub(r'\*+|<br>', ' ', s)).strip().lower()


def doc():
    dong = []
    for f in NGUON:
        t = open(f, encoding='utf-8').read()
        i = t.find(MOC)
        # file sau la phan noi tiep cua bang, khong lap lai tieu de phu luc
        i = i if i >= 0 else 0
        for ln in t[i:].split('\n'):
            ln = ln.strip()
            if ln.startswith('|') and ln.endswith('|'):
                dong.append(ln)
    return dong


def main():
    dong = doc()
    tich = {}   # ma -> {'ten':str, 'yc':str, 'mc':str}
    thu_tu = []
    noi = 0
    lap_manh = []
    for ln in dong:
        o = [c.strip() for c in ln.strip('|').split('|')]
        if len(o) < 3:
            continue
        dau = don_o(o[0])
        if dau.startswith('Tiêu chuẩn/') or set(dau) <= set('- '):
            continue

        m = re.match(r'Tiêu chí\s+(\d+\.\d+)', dau, re.I)
        # ban phien am dung BON kieu danh dau tran trang, khac nhau ca chu hoa lan tu ngu:
        #   (tiep Tieu chi X.Y) · (tiep tieu chi X.Y) · (tiep trang truoc) · (o trong, tiep tieu chi X.Y)
        mt = re.match(r'\((?:ô trống,\s*)?tiếp\s+(?:tiêu chí\s+(\d+\.\d+)|trang trước)\)', dau, re.I)
        if not m and not mt:
            continue

        if mt:                                   # dong tran trang: noi vao o cua tieu chi truoc
            ma = mt.group(1) or (thu_tu[-1] if thu_tu else None)
            if ma not in tich:
                raise SystemExit('dong tiep noi cho tieu chi chua co: %s' % ma)
            noi += 1
            for khoa, cot in (('ten', 0), ('yc', 1), ('mc', 2)):
                them = o[cot].strip()
                if khoa == 'ten':
                    them = re.sub(r'^\s*\*?\((?:ô trống,\s*)?tiếp[^)]*\)\*?\s*', '', them)
                them = re.sub(r'^\s*\*?\(ô trống\)\*?\s*$', '', them)   # o de trong, khong phai chu
                if not them:
                    continue
                # O gốc kết thúc bằng nhãn "(tiếp trang sau)" nghĩa là câu bị cắt giữa
                # chừng, nên mảnh đầu trang sau là phần nối THẬT, phải giữ. Không có
                # nhãn đó mà mảnh đầu đã nằm sẵn trong ô thì đấy là trang sau chép lại
                # phần đuôi trang trước, mới được bỏ.
                bi_cat = re.search(r'\(tiếp trang sau\)\s*$', gon(tich[ma][khoa]))
                manh = re.split(r'<br>', them)[0].strip()
                if not bi_cat and manh \
                        and not re.match(r'^\**\s*(\d{1,2}[\.\)]\s|[-–—•]\s)', manh) \
                        and gon(manh) and gon(manh) in gon(tich[ma][khoa]):
                    lap_manh.append('%s cot%d' % (ma, cot + 1))
                    them = them[len(re.split(r'<br>', them)[0]):].lstrip()
                    if not them:
                        continue
                # trang sau mo dau bang muc moi -> xuong dong; ngat giua cau -> noi lien
                dau_muc = re.match(r'^\**\s*(\d{1,2}[\.\)]\s|[-–—•]\s)', them)
                tich[ma][khoa] += ('\n' if dau_muc else ' ') + them
            continue

        ma = m.group(1)
        ten = re.sub(r'^Tiêu chí\s+\d+\.\d+\s*(\[Tiêu chí điều kiện\])?\s*:?\s*', '', dau)
        if ma in tich:
            raise SystemExit('tieu chi lap khong phai dong tiep: ' + ma)
        tich[ma] = {'ten': ten, 'dieu_kien': 'điều kiện' in dau.lower(),
                    'yc': o[1], 'mc': o[2]}
        thu_tu.append(ma)

    # cong 1: moi dong tran trang trong nguon phai duoc noi, khong duoc bo im lang.
    # Dem bang duong KHAC parser (tim chuoi trong o dau, khong dung regex cua parser)
    # vi lan truoc cong dung chung diem mu voi parser nen bao PASS oan.
    cho = 0
    for f in NGUON:
        for ln in open(f, encoding='utf-8').read().split('\n'):
            ln = ln.strip()
            if not (ln.startswith('|') and ln.endswith('|')):
                continue
            o1 = gon(ln.strip('|').split('|')[0])
            if 'tiếp tiêu chí' in o1 or 'tiếp trang trước' in o1:
                cho += 1
    print('So dong tran trang: nguon %d, da noi %d' % (cho, noi))
    if cho != noi:
        raise SystemExit('CONG 1 FAIL: bo sot %d dong tran trang' % (cho - noi))

    print('Manh dau trang lap lai da bo: %s' % (lap_manh or 'khong'))

    ra = {}
    bo_trung = []

    def khong_trung(xs, ma, nh):
        thay, ket = set(), []
        for x in xs:
            k = gon(x)
            if k in thay:
                bo_trung.append('%s %s' % (ma, nh))
                continue
            thay.add(k)
            ket.append(x)
        return ket

    for ma in thu_tu:
        d = tich[ma]
        yc = khong_trung(tach_muc(d['yc'], 'so'), ma, 'yeu_cau')
        mc = khong_trung(tach_muc(d['mc'], 'gach'), ma, 'minh_chung')
        # bo ca nhan tran trang lan ghi chu cua nguoi phien am, vd "(tiep trang sau, ngoai pham vi...)"
        ten = re.sub(r'\(tiếp[^)]*\)', '', d['ten'])
        ten = re.sub(r'\s+', ' ', ten).strip()
        ra[ma] = {'ten': ten, 'dieu_kien': d['dieu_kien'],
                  'yeu_cau': yc, 'minh_chung': mc}

    print('Muc trung nhau da gop: %s' % (bo_trung or 'khong'))
    json.dump(ra, open('tt04-phuluc2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    # doi chieu
    print('Tong tieu chi boc duoc: %d' % len(ra))
    thieu_yc = [k for k, v in ra.items() if not v['yeu_cau']]
    thieu_mc = [k for k, v in ra.items() if not v['minh_chung']]
    print('Thieu yeu cau: %s' % (thieu_yc or 'khong'))
    print('Thieu minh chung: %s' % (thieu_mc or 'khong'))
    dk = [k for k, v in ra.items() if v['dieu_kien']]
    print('Tieu chi dieu kien (%d): %s' % (len(dk), ' '.join(sorted(dk, key=lambda x: tuple(map(int, x.split('.')))))))
    tong_yc = sum(len(v['yeu_cau']) for v in ra.values())
    tong_mc = sum(len(v['minh_chung']) for v in ra.values())
    print('Tong muc yeu cau: %d | tong muc minh chung: %d' % (tong_yc, tong_mc))
    it = [(k, len(v['yeu_cau']), len(v['minh_chung'])) for k, v in ra.items()
          if len(v['yeu_cau']) < 2 or len(v['minh_chung']) < 3]
    print('Tieu chi it muc (can soi lai): %s' % (it or 'khong'))

    # cong 2: khong con nhan tran trang lot vao noi dung
    sot = [(k, s[:90]) for k, v in ra.items()
           for s in [v['ten']] + v['yeu_cau'] + v['minh_chung']
           if re.search(r'tiếp trang|tiếp tiêu chí', s, re.I)]
    print('Con sot nhan tran trang: %s' % (sot or 'khong'))
    if sot:
        raise SystemExit('CONG 2 FAIL')

    # cong 3: khong muc nao ket thuc lo lung, tuc bi cat trang ma chua noi lai.
    # Cong nay do HAU QUA (chu bi cut) chu khong dem nhan, nen khong chung diem mu
    # voi bo nhan dien dong tran trang.
    LO_LUNG = ('và', 'các', 'của', 'với', 'trong', 'được', 'là', 'cho', 'về', 'theo', 'đã', 'có')
    cut = [(k, nh, x[-70:]) for k, v in ra.items() for nh in ('yeu_cau', 'minh_chung')
           for x in v[nh]
           if x.rstrip().endswith(',') or x.rstrip().split(' ')[-1].lower() in LO_LUNG]
    print('Muc ket thuc lo lung: %s' % (cut or 'khong'))
    if cut:
        raise SystemExit('CONG 3 FAIL: con %d muc bi cat' % len(cut))

    # cong 4: du 52 tieu chi va dung 10 tieu chi dieu kien theo Dieu 13
    DK = {'1.3', '1.6', '2.2', '2.4', '3.2', '4.5', '5.2', '6.1', '7.3', '8.2'}
    if len(ra) != 52 or set(dk) != DK:
        raise SystemExit('CONG 4 FAIL: %d tieu chi, dieu kien %s' % (len(ra), sorted(dk)))
    print('CONG 1-2-3-4: PASS')


main()
