// ข้อความสองภาษา + ข้อมูลที่ผูกกับภาษา ใช้ร่วมกันทุกหน้า (แต่ละหน้าโหลดไฟล์นี้ผ่าน <script src>)

function buildTranslations(en) {
  return {
    nav: {
      manageProfileLink: en ? 'Manage My Tickets' : 'จัดการบัตรของฉัน',
      logoutLink: en ? 'Log out' : 'ออกจากระบบ'
    },
    footer: {
      termsLink: en ? 'Terms of Use' : 'ข้อกำหนดการใช้งาน',
      privacyLink: en ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว',
      contactLink: en ? 'Contact the team' : 'ติดต่อทีมงาน',
      disclaimer: en
        ? 'LYKN Reflexion Concert — a fan-made project, not an official channel.'
        : 'LYKN Reflexion Concert — โปรเจกต์ที่แฟนคลับทำขึ้นเอง ไม่ใช่ช่องทางทางการ'
    },
    home: {
      dateLine: en ? 'October 23-25, 2026  |  Impact Arena, Muang Thong Thani' : '23 - 25 ตุลาคม 2569  |  อิมแพ็ค อารีน่า เมืองทองธานี',
      concertLabel: en ? 'Concert starts in' : 'วันจัดคอนเสิร์ตในอีก',
      concertNote: en ? 'Friday, Oct 23 – Sunday, Oct 25, 2026' : 'ศุกร์ที่ 23 ถึง อาทิตย์ที่ 25 ตุลาคม 2569',
      ctaDetails: en ? 'View Concert Details' : 'ดูรายละเอียดคอนเสิร์ต',
      liveStreamingNote: en
        ? 'Live Streaming tickets are still available — buy via thaiticketmajor.com'
        : 'บัตร Live Streaming ยังมีอยู่ ซื้อบัตรได้ทาง thaiticketmajor.com'
    },
    currency: en ? 'THB' : 'บาท',
    details: {
      title: en ? 'Concert Details' : 'รายละเอียดคอนเสิร์ต',
      subtitle: en ? 'LYKN REFLEXION CONCERT — October 23-25, 2026' : 'LYKN REFLEXION CONCERT — 23-25 ตุลาคม 2569',
      venueHeading: en ? 'Venue' : 'สถานที่แสดง',
      priceHeading: en ? 'Ticket Prices & Seat Map' : 'ราคาบัตร และผังที่นั่ง',
      seatplanAlt: en ? 'Seat map, Impact Arena Muang Thong Thani' : 'ผังที่นั่ง อิมแพ็ค อารีน่า เมืองทองธานี',
      channelHeading: en ? 'Where to Buy' : 'ช่องทางการซื้อ',
      openSaleLabel: en ? 'On sale' : 'เปิดขาย',
      buyBtn: en ? 'Buying Details' : 'รายละเอียดราคาบัตร',
      pickupBtn: en ? 'Pickup Details' : 'รายละเอียดการรับบัตร',
      scheduleHeading: en ? 'Detailed Schedule' : 'กำหนดการแบบละเอียด',
      addCalendarBtn: en ? '📅 Add Schedule to Calendar' : '📅 เพิ่มกำหนดการลงปฏิทิน',
      rulesHeading: en ? 'Entry Rules' : 'ระเบียบการเข้างาน',
      rulesNote: en ? 'Note: The organizers reserve the right to change these terms and rules as appropriate.' : 'หมายเหตุ: ทางทีมงานขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขหรือกฎกติกาตามความเหมาะสม',
      rules: en ? [
        'Sound Check, Hi-Touch, and Hi-Session winners must register onsite between 8:00 AM–2:00 PM. Missing this window forfeits the benefit (but you can still watch the show as normal).',
        'No food or drinks of any kind allowed inside the venue.',
        'No weapons or sharp objects of any kind allowed inside the venue.',
        'No camera flash allowed.',
        'No 50-230 / 70-200 / 70-300 / 300-400 / 600mm zoom lenses, 1.4x/2x teleconverters, pro zoom/compact cameras, or any built-in lens over 150mm allowed (14-150 / 40-150 / 24-105 / 18-135mm zoom lenses are OK).',
        'No video recording, audio recording, or live streaming with any device through any platform or app — violators will have their recordings deleted and be asked to leave immediately.',
        'No signs or banners of any kind or size during the show, as they block the view of audience members behind you.'
      ] : [
        'ผู้ที่ได้รับสิทธิ์ร่วมกิจกรรม Sound Check, Hi-Touch และ Hi-Session ต้องมาลงทะเบียนรับสิทธิ์ที่หน้างานตั้งแต่ 08:00–14:00 น. หากไม่ลงทะเบียนในเวลาดังกล่าวถือว่าสละสิทธิ์ (แต่เข้าชมโชว์ได้ตามปกติ)',
        'ไม่อนุญาตให้นำอาหารและเครื่องดื่มทุกชนิดเข้าภายในงาน',
        'ไม่อนุญาตให้นำอาวุธหรือของมีคมทุกชนิดเข้าภายในงาน',
        'ไม่อนุญาตให้ใช้แฟลชในการถ่ายภาพ',
        'ไม่อนุญาตให้นำเลนส์ซูมระยะ 50-230 / 70-200 / 70-300 / 300-400 / 600, Teleconverter x1.4 และ x2, กล้อง Pro Zoomer, Compact Camera หรือกล้องที่มีเลนส์ในตัวเกินระยะ 150 เข้าภายในงาน (เลนส์ซูม 14-150 / 40-150 / 24-105 หรือ 18-135 นำเข้าได้)',
        'ไม่อนุญาตให้บันทึกวิดีโอ บันทึกเสียง หรือถ่ายทอดสดภาพและเสียง (LIVE) ด้วยอุปกรณ์ทุกชนิดผ่านช่องทางหรือแอปพลิเคชันใดๆ — หากฝ่าฝืน ทีมงานสงวนสิทธิ์ลบภาพ/วิดีโอ/เสียงที่บันทึกไว้ และเชิญออกจากงานทันที',
        'ไม่อนุญาตให้ชูป้ายทุกชนิดทุกขนาดระหว่างการแสดง เนื่องจากกระทบการรับชมของผู้ชมที่อยู่ด้านหลัง'
      ]
    },
    whereSeat: {
      subtitle: en
        ? "Pick a zone on the map to see how many rows and seats it has. Click a zone for a virtual seat POV, or open the seat plan for exact numbers."
        : 'เลือกโซนบนผังเพื่อดูจำนวนแถวและที่นั่ง หรือดูมุมมองจำลองจากที่นั่งจริง (เป็นข้อมูลการจำลองมุมมองเท่านั้น) หรือทำการค้นหาที่นั่งของตัวเองในคอนเสิร์ต',
      peopleUnit: en ? 'registered' : 'คนลงทะเบียนแล้ว',
      mapInstruction: en ? 'Click the zone you want to see seat details' : 'คลิกที่โซนที่ต้องการเพื่อดูรายละเอียดที่นั่ง',
      mapHint: en
        ? 'The camera view shown is a rough approximation only — not confirmed LYKN data.'
        : 'มุมมองที่แสดงเป็นการคาดการณ์คร่าวๆเท่านั้น ยังไม่ใช่ข้อมูลยืนยันของ LYKN REFLEXION CONCERT',
      registerHeading: en ? 'Register your seat' : 'ลงทะเบียนที่นั่งของฉัน',
      registerBody: en
        ? 'Claim your seat so friends nearby can find you. Opens once tickets go on sale.'
        : 'ลงทะเบียนที่นั่งของคุณ เพื่อให้เพื่อน ๆ ที่นั่งใกล้กันหาคุณเจอ เปิดใช้งานเมื่อบัตรวางจำหน่ายแล้ว',
      registerBtn: en ? 'Register My Seat' : 'ลงทะเบียนที่นั่งของฉัน',
      modalTitle: en ? 'Register My Seat' : 'ลงทะเบียนที่นั่งของฉัน',
      modalNote: en
        ? 'Preview only — this form activates once tickets go on sale on Aug 22, 2026.'
        : 'ตัวอย่าง UI เท่านั้น — ฟอร์มนี้จะเปิดใช้งานจริงหลังบัตรวางจำหน่าย 22 ส.ค. 2569',
      nameLabel: en ? 'Name / Nickname' : 'ชื่อ/นามแฝง',
      roundLabel: en ? 'Round' : 'รอบที่',
      zoneLabel: en ? 'Zone / Row / Seat No.' : 'โซน / แถว / เลขที่นั่ง',
      close: en ? 'Close' : 'ปิด',
      submitDisabled: en ? 'Confirm (disabled)' : 'ยืนยัน (ปิดใช้งาน)',
      summaryHeading: en ? 'Total Seat Count' : 'สรุปที่นั่งทั้งหมด',
      summaryTotalUnit: en ? 'seats across the whole venue' : 'ที่นั่งทั้งหมดในฮอลล์',
      summarySeatUnit: en ? 'seats' : 'ที่นั่ง',
      summaryZoneUnit: en ? 'zones' : 'โซน',
    },
    seatCheck: {
      heading: en ? "Check a Seller's Seat" : 'ตรวจสอบที่นั่งของผู้ขาย',
      intro: en
        ? "Fan-made tool: fill in the seat and the seller's account x.com handle to see if they match. This only ever answers match / no-match / pending — it never lists who owns any seat."
        : 'เครื่องมือที่แฟนคลับทำขึ้น กรอกที่นั่งและ account x.com ผู้ขายเพื่อเช็คว่าตรงกันไหม ระบบตอบได้แค่ตรง/ไม่ตรง/รอตรวจสอบ ไม่แสดงรายชื่อเจ้าของที่นั่งใดๆ ทั้งสิ้น',
      roundLabel: en ? 'Show' : 'รอบการแสดง',
      roundPlaceholder: en ? 'Select a show' : 'เลือกรอบการแสดง',
      zoneLabel: en ? 'Zone' : 'โซน',
      zonePlaceholder: en ? 'Select a zone' : 'เลือกโซน',
      rowLabel: en ? 'Row' : 'แถว',
      rowPlaceholder: en ? 'Select a row' : 'เลือกแถว',
      seatLabel: en ? 'Seat No.' : 'เลขที่นั่ง',
      seatPlaceholder: en ? 'e.g. 12' : 'เช่น 12',
      sellerHandleLabel: en ? "Seller's account x.com handle" : 'account x.com ของผู้ขาย',
      sellerHandlePlaceholder: en ? 'accounthandle' : 'accounthandle',
      checkBtn: en ? 'Check' : 'ตรวจสอบ',
      checkBtnLoading: en ? 'Checking…' : 'กำลังตรวจสอบ...',
      autofilledFromMap: en ? 'Filled in from the seat map' : 'เติมข้อมูลจากผังที่นั่งให้แล้ว',
      formIncomplete: en ? 'Please fill in all fields' : 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
      rateLimited: en ? 'A lot of people are checking right now — please try again in a moment.' : 'ตอนนี้มีคนใช้งานพร้อมกันเยอะ กรุณาลองใหม่อีกครั้งในอีกสักครู่',
      genericError: en ? 'Something went wrong. Please try again.' : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      removalWarning: en
        ? 'This seat has had a registration removed {n} times in the last 7 days.'
        : 'ที่นั่งนี้เคยมีผู้ลงทะเบียนและลบออกมาก่อน {n} ครั้ง ในช่วง 7 วันที่ผ่านมา',
      removalNeutral: en
        ? 'This seat has had a registration removed {n} time(s) before.'
        : 'ที่นั่งนี้เคยมีผู้ลงทะเบียนและลบออกมาก่อน {n} ครั้ง',
      noAccuseNote: en
        ? 'Please do not use verification results to accuse anyone, under any circumstances.'
        : 'กรุณาไม่นำผลการตรวจสอบไปกล่าวหาผู้อื่นในทุกกรณี',
      disclaimer: en
        ? 'This is a fan-made tool, not affiliated with the organizer, artist, agency, or ticket vendor. It cannot verify ticket authenticity and is not a party to any transaction.'
        : 'เครื่องมือนี้ทำโดยแฟนคลับ ไม่ใช่ระบบของผู้จัดงาน ศิลปิน ค่าย หรือผู้ขายบัตร ไม่สามารถยืนยันความแท้ของบัตรได้ และไม่มีส่วนเกี่ยวข้องกับการซื้อขายใดๆ ทั้งสิ้น',
      results: {
        NOT_FOUND: {
          title: en ? 'No data yet' : 'ยังไม่มีข้อมูล',
          desc: en ? 'This seat has not been registered by anyone in the system.' : 'ที่นั่งนี้ยังไม่มีใครลงทะเบียนไว้ในระบบ',
        },
        MATCH_UNVERIFIED: {
          title: en
            ? 'Seat info matches what’s registered under @{handle} — not yet verified'
            : 'ข้อมูลที่นั่งตรงกับที่ลงทะเบียนไว้ใน @{handle} แต่ยังไม่ได้รับการยืนยัน',
          desc: en
            ? 'This matches what was registered, but the seat has not yet passed verification or evidence review.'
            : 'ข้อมูลที่นั่งตรงกับที่ลงทะเบียนไว้ แต่ที่นั่งนี้ยังไม่ผ่านการยืนยันหรือตรวจสอบหลักฐาน',
        },
        MATCH_VERIFIED: {
          title: en ? 'Seat info matches @{handle} and is verified' : 'ข้อมูลที่นั่งตรงกับ @{handle} และยืนยันแล้ว',
          desc: en
            ? 'This matches what was registered, and the team has reviewed the evidence and verified it.'
            : 'ข้อมูลที่นั่งตรงกันกับที่มีการลงทะเบียนไว้ โดยทีมงานตรวจสอบหลักฐานและยืนยันแล้ว',
        },
        UNDER_REVIEW: {
          title: en ? 'Seat info is under review by the team' : 'ข้อมูลที่นั่งอยู่ระหว่างการตรวจสอบโดยทีมงาน',
          desc: en
            ? 'More than one person has claimed this seat — the team is reviewing it.'
            : 'มีผู้อ้างสิทธิ์ที่นั่งนี้มากกว่าหนึ่งคน ทีมงานกำลังดำเนินการตรวจสอบ',
        },
        NO_MATCH: {
          title: en ? 'Seat info does not match @{handle}' : 'ข้อมูลที่นั่งไม่ตรงกับ @{handle} ที่ลงทะเบียนไว้',
          desc: en
            ? 'Please double-check the details, or ask the ticket owner directly. If this is your seat, please go to the registration page and submit evidence for the team to review, or contact the team via x.com @susakiiverse.'
            : 'โปรดตรวจสอบข้อมูลอีกครั้ง หรือสอบถามเจ้าของบัตรถึงข้อมูลที่ถูกต้อง กรณีที่เป็นบัตรที่นั่งของคุณ โปรดไปที่หน้าลงทะเบียนบัตรและยื่นหลักฐานยืนยันบัตรเพื่อให้ทีมงานตรวจสอบ หรือติดต่อทีมงานที่ x.com @susakiiverse',
        },
        // ไม่ใช่สถานะจริงจาก check_seat — client ใช้ key นี้แทนเมื่อ response มี
        // is_own: true (คนที่กำลังเช็ค login อยู่ และเป็นเจ้าของ claim ของที่นั่งนี้เอง)
        // ข้อความเดียวกันไม่ว่า claim จะยืนยันแล้วหรือยังไม่ยืนยันก็ตาม
        OWN_SEAT: {
          title: en ? 'You already have this seat registered' : 'คุณลงทะเบียนที่นั่งนี้ไว้อยู่แล้ว',
          desc: en
            ? 'To edit the registration or upload evidence, manage it from the "My Tickets" menu.'
            : 'ถ้าต้องการแก้ไขการลงทะเบียน หรืออัปโหลดเอกสารเพื่อยืนยันบัตร โปรดจัดการที่เมนู "บัตรของฉัน"',
        },
      },
    },
    fanBenefit: { heading: 'Fan Benefit', ticketPricesCol: 'TICKET PRICES' },
    buyModal: {
      title: en ? 'Buying Details' : 'รายละเอียดการซื้อบัตร',
      limitLabel: en ? 'Purchase Limits' : 'จำกัดจำนวนซื้อ',
      limits: en ? [
        '1 ID card/passport number can purchase once per show.',
        'Maximum 4 tickets per ID number per show (8 tickets total across both shows).'
      ] : [
        '1 หมายเลขบัตรประชาชน/พาสปอร์ต ซื้อได้ 1 ครั้ง ต่อ 1 รอบการแสดง',
        'ซื้อได้สูงสุด 4 ใบ ต่อ 1 เลขบัตร ต่อ 1 รอบการแสดง (รวม 2 รอบ = 8 ใบ)'
      ],
      paymentLabel: en ? 'Payment Methods (3% fee)' : 'ช่องทางการชำระเงิน (ค่าธรรมเนียม 3%)',
      priceFeeLabel: en ? 'Ticket Price incl. Fee' : 'ราคาบัตรรวมค่าธรรมเนียม',
      priceCol: en ? 'Ticket Price' : 'ราคาบัตร',
      priceFeeCol: en ? 'Price incl. Fee' : 'ราคารวมค่าธรรมเนียม',
      close: en ? 'Close' : 'ปิด'
    },
    pickupModal: {
      title: en ? 'Pickup Details' : 'รายละเอียดการรับบัตร',
      rules: en ? [
        'Pick up at any of the 11 main Thai Ticket Major branches during the scheduled window.',
        "If you can't make it during that window, you can only pick up at the onsite booth on show day (for the show you purchased).",
        'Mail delivery is not available.',
        'You must present the original ID card/passport matching the number used at purchase.'
      ] : [
        'รับบัตรได้ที่ไทยทิคเก็ตเมเจอร์ 11 สาขาหลัก ตามช่วงเวลาที่กำหนด',
        'หากไม่สามารถมารับได้ในช่วงเวลาดังกล่าว รับได้ที่บูธหน้างานในวันแสดงเท่านั้น (เฉพาะรอบที่ซื้อ)',
        'ไม่สามารถเลือกรับบัตรทางไปรษณีย์ได้',
        'ต้องแสดงบัตรประชาชน/พาสปอร์ตตัวจริง ที่มีหมายเลขตรงกับข้อมูลที่ใช้ลงทะเบียนซื้อบัตร'
      ],
      caseLabel: en ? 'Select Your Case' : 'เลือกกรณีของคุณ',
      ownerLabel: en ? 'Account owner' : 'เจ้าของ account',
      bookedLabel: en ? 'ID used at booking' : 'เลขบัตรตอนจอง',
      pickerLabel: en ? "Who's picking up" : 'คนไปรับ',
      docsLabel: en ? 'Documents Required' : 'ต้องใช้เอกสาร',
      noMatch: en ? 'No matching case found. Please contact onsite staff or Call Center 02-262-3456.' : 'ไม่พบเงื่อนไขสำหรับกรณีนี้ กรุณาติดต่อเจ้าหน้าที่หน้างานหรือ Call Center 02-262-3456',
      noteFooter: en ? [
        'You must bring your order confirmation to pick up the ticket (printed or shown on your phone is fine).',
        "For any case using a photocopy, it must note: power of attorney / order number / picker's name.",
        'Pick up at any of the 11 main Thai Ticket Major branches during the scheduled window, or at the onsite TTM booth on show day.'
      ] : [
        'ต้องนำใบยืนยันการสั่งซื้อ ไปแสดงเพื่อรับบัตร (ปริ้นหรือเปิดจากมือถือได้)',
        'ทุกกรณีที่ใช้สำเนาบัตร สำเนาต้องเขียนระบุ: มอบอำนาจ / เลขออเดอร์ / ชื่อผู้มารับ',
        'รับบัตรได้ที่ไทยทิคเก็ตเมเจอร์ 11 สาขาหลัก ตามช่วงเวลาที่กำหนด หรือที่บูธ TTM หน้างานในวันแสดง'
      ],
      close: en ? 'Close' : 'ปิด',

      lostProofHeading: en ? 'If Your Payment Proof Is Lost or Damaged' : 'กรณีหลักฐานการชำระเงินหาย หรือชำรุด',
      lostProofIntro: en ? '(e.g. the original receipt, an ATM slip, or a bank counter payment slip)' : '(เช่น ใบเสร็จชำระเงินตัวจริง สลิปจากตู้เอทีเอ็ม หรือใบรับชำระจากเคาน์เตอร์ธนาคาร)',
      lostProofSeatHeading: en ? 'For seat-assigned tickets' : 'สำหรับบัตรระบุที่นั่ง',
      lostProofSeatDocs: en ? [
        "Order owner's ID card (or a signed copy noting who's authorized to pick up instead)",
        "If you're not the order owner, also bring a copy of the owner's ID card",
        'An original police report',
        'Contact the onsite TTM booth on show day to request your ticket'
      ] : [
        'บัตรประชาชนตัวจริงของเจ้าของออเดอร์ (หรือสำเนา เซ็นระบุมอบอำนาจว่าให้ใครรับแทน)',
        'ถ้าไม่ใช่เจ้าของออเดอร์ ต้องมีสำเนาบัตรประชาชนของเจ้าของออเดอร์ไปด้วย',
        'ใบแจ้งความตัวจริง',
        'ติดต่อบูธ TTM หน้างานแสดง เพื่อขอรับบัตร'
      ],
      lostProofStandingHeading: en ? 'For standing / no-seat tickets' : 'สำหรับบัตรไม่ระบุที่นั่ง / บัตรยืน',
      lostProofStandingDocs: en ? [
        'Same documents as seat-assigned tickets (ID card + original police report)',
        'Contact the onsite TTM booth on show day'
      ] : [
        'เอกสารเหมือนกรณีบัตรระบุที่นั่ง (บัตรประชาชน + ใบแจ้งความตัวจริง)',
        'ติดต่อบูธ TTM หน้างานแสดง'
      ],
      lostProofStandingWarning: en ? 'For this ticket type, the company reserves the right not to reissue a new ticket under any circumstances — please keep your payment proof safe.' : 'สำหรับบัตรประเภทนี้ ทางบริษัทขอสงวนสิทธิ์ไม่ออกบัตรใหม่ให้ในทุกกรณี กรุณาเก็บหลักฐานการชำระเงินไว้ให้ดี',

      cardPaymentHeading: en ? 'Pickup When Paid by Credit/Debit Card' : 'รับบัตรกรณีชำระด้วยบัตรเครดิต/เดบิต',
      cardPaymentSelfHeading: en ? 'Cardholder picking up in person' : 'เจ้าของบัตรมารับด้วยตนเอง',
      cardPaymentSelfDocs: en ? [
        'Order confirmation slip',
        'The credit/debit card used to pay',
        "Cardholder's original ID card"
      ] : [
        'ใบยืนยันคำสั่งซื้อ',
        'บัตรเครดิต/เดบิตใบที่ใช้ชำระเงิน',
        'บัตรประชาชนตัวจริงของเจ้าของบัตร'
      ],
      cardPaymentOtherHeading: en ? 'Someone else picking up instead' : 'ให้คนอื่นรับแทน',
      cardPaymentOtherDocs: en ? [
        'Order confirmation slip + a filled-out authorization form (with the last 4 digits of the card)',
        'A signed copy of the card used (both front and back)',
        "A signed copy of the cardholder's ID card",
        "A copy of the picker's ID card",
        "The picker's original ID card"
      ] : [
        'ใบยืนยันคำสั่งซื้อ พร้อมกรอกแบบฟอร์มใบมอบอำนาจ (ระบุเลขบัตร 4 หลักสุดท้าย)',
        'สำเนาบัตรที่ใช้สั่งซื้อ (ทั้งด้านหน้า-หลัง เซ็นสำเนาถูกต้อง)',
        'สำเนาบัตรประชาชนของเจ้าของบัตร (เซ็นสำเนาถูกต้อง)',
        'สำเนาบัตรประชาชนของผู้รับ',
        'บัตรประชาชนตัวจริงของผู้รับมอบอำนาจ'
      ]
    },
    howto: {
      title: en ? 'How to Buy Tickets' : 'วิธีการกดบัตร',
      subtitle: en ? 'A simplified, step-by-step guide to buying on thaiticketmajor.com' : 'สรุปขั้นตอนการซื้อบัตรบน thaiticketmajor.com แบบเข้าใจง่าย ทำตามได้เลย',
      moreLabel: en ? 'Want more detail on buying or pickup?' : 'อยากรู้รายละเอียดเพิ่มเติมเรื่องการซื้อหรือรับบัตร?',
      stepLabel: en ? 'Step' : 'ขั้นตอนที่',
      steps: en ? [
        'Pick the show you want. When it\'s time to join the queue, a button will appear for you to click and get your queue number.',
        'Before 10:00 AM, the system takes you to a queue-waiting page with a countdown timer, so you\'re ready to get your queue number right at 10:00 AM.',
        'At exactly 10:00 AM, the countdown screen automatically switches to the queue-ticket page.',
        'Enter your ID card or passport number carefully to verify your identity — this number must exactly match your real ID when you pick up the ticket later.',
        'Choose your seat: click a zone to see available seats, pick one, then click "Buy Now" to confirm.',
        'Once you\'ve picked your seat, click the confirm-seat button, and the system takes you to the payment method page. After choosing a payment method, double-check your order — at this step, deselect Ticket Protect if you don\'t want it (it costs extra) — then click "Confirm Order."',
        'Once confirmed, complete your payment — that\'s it, you\'ve successfully bought your ticket.'
      ] : [
        'เลือกรายการแสดงที่ต้องการ เมื่อถึงเวลารับคิว จะแสดงปุ่มเพื่อกดให้รับคิว',
        'ก่อนเวลา 10:00 น. ระบบจะพาเข้าสู่หน้ารอคิว ลูกค้าจะเข้าสู่หน้าจอแสดงเวลานับถอยหลัง เพื่อรอรับคิวในเวลา 10:00 น. ตรง',
        'เวลา 10:00 น. หน้าจอแสดงเวลานับถอยหลัง จะเปลี่ยนไปยังหน้ารับบัตรคิวโดยอัตโนมัติ',
        'กรอกเลขบัตรประชาชนหรือพาสปอร์ตให้ถูกต้อง เพื่อยืนยันตัวตน — เลขนี้ต้องตรงกับบัตรตัวจริงตอนไปรับบัตรเป๊ะๆ',
        'คลิกโซนที่ต้องการเพื่อดูที่นั่งว่าง หลังจากนั้นกดเลือกที่นั่งที่ต้องการ (ถ้าเลือกสำเร็จจะขึ้นเครื่องหมายถูกตรงที่เลือก) หลังจากนั้น "ยืนยันที่นั่ง"',
        'เมื่อเลือกที่นั่งได้แล้วกดปุ่มยืนยันที่นั่ง และระบบจะพาไปที่หน้าเลือกวิธีการชำระเงิน เมื่อเลือกวิธีการชำระเงินแล้ว ตรวจสอบรายการสั่งซื้อให้ถูกต้อง ในขั้นตอนนี้กดยกเลิกการเลือก Ticket Protect ออกกรณีไม่ต้องการ (อันนี้เสียตังเพิ่ม) แล้วกด "ยืนยันคำสั่งซื้อ"',
        'เมื่อกดยืนยันแล้ว ชำระเงินให้เรียบร้อย ถือเป็นการกดบัตรสำเร็จ'
      ],
      step5Sub: en
        ? 'If someone else has already booked that seat, a warning pop-up will appear — close it and pick a different seat.'
        : 'กรณีที่ที่นั่งมีการจองไปมีคนเลือกไปแล้วหรือไม่สามารถเลือกได้จะแสดง pop-up แจ้งเตือน ให้กดปิดและเลือกที่นั่งใหม่',
      zoneWarning: en
        ? 'One order can only include seats within the same zone. If you want a different zone, or tickets for another day, you\'ll need to join the queue again.'
        : 'ใน 1 รายการคำสั่งซื้อกดได้แค่ภายในโซนเดียวกันเท่านั้น ถ้าต้องการโซนอื่นเพิ่มเติม หรือกดของวันอื่นต้องต่อคิวใหม่อีกครั้ง'
    },
    tips: {
      title: en ? 'Ticket-Buying Tips' : 'เคล็ดลับการกดบัตร',
      warningLabel: en ? 'Important Note' : 'หมายเหตุสำคัญ',
      warningText: en ? 'All tips are compiled from real user experiences on social media — results are not guaranteed 100%.' : 'เทคนิคทั้งหมดรวบรวมจากประสบการณ์จริงของผู้ใช้งานในโซเชียลมีเดีย ไม่ได้รับประกันผลลัพธ์ 100%'
    },
    faq: {
      title: en ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย',
      searchPlaceholder: en ? 'Search questions, e.g. pickup, payment, refund' : 'ค้นหาคำถาม เช่น รับบัตร, ชำระเงิน, คืนเงิน',
      noResultsPrefix: en ? 'No questions match "' : 'ไม่พบคำถามที่ตรงกับ "',
      noResultsSuffix: en ? '". Try a different search term.' : '" ลองค้นด้วยคำอื่นดูนะ'
    },
    gacha: {
      title: en ? 'Lucky Draw — Blessing Cards' : 'สุ่มกาชาการ์ดอวยพร (Lucky Draw)',
      subtitle: en ? 'Tap any card to draw a blessing card before you go buy tickets' : 'แตะการ์ดใบไหนก็ได้ เพื่อสุ่มการ์ดอวยพร 1 ใบ ก่อนไปกดบัตร',
      drawBtn: en ? 'Draw a Card' : 'สุ่มการ์ดอวยพร',
      drawingText: en ? 'Drawing your card...' : 'กำลังสุ่มการ์ด...',
      downloadBtn: en ? 'Download' : 'ดาวน์โหลด',
      drawAgainBtn: en ? 'Draw Again' : 'สุ่มใหม่',
      closeBtn: en ? 'Close' : 'ปิด'
    },
    watchlist: {
      title: 'LYKN Watchlist',
      subtitle: en ? "While you wait for the concert (or if you brought your partner and they've got nothing to do), catch up on LYKN members' series and songs here — so next time, you won't just be waiting outside, you'll be going in to watch a concert together" : 'ระหว่างรอคอนเสิร์ตมา หรือใครพาแฟน พาเพื่อน พาครอบครัวไปรอเราดูคอนเสิร์ตแล้วไม่มีอะไรทำ ลองมา ดูซีรีย์และฟังเพลงของสมาชิก LYKN รอกันได้ เผื่อรอบหน้าจะได้ไม่รอหน้าคอนแต่เข้าคอนไปดูด้วยกัน',
      seriesHeading: en ? 'Series featuring LYKN' : 'ซีรีย์ที่ LYKN ร่วมแสดง',
      filterLabel: en ? 'Filter by member' : 'กรองตามสมาชิก',
      allOptionLabel: en ? 'All' : 'ทั้งหมด',
      airedLabel: en ? 'Aired:' : 'ออกอากาศ:',
      castLabel: en ? 'LYKN cast:' : 'นักแสดง LYKN:',
      songsHeading: en ? 'LYKN songs' : 'เพลงของ LYKN',
      soloLabel: en ? 'Solo songs' : 'Solo Single',
      groupLabel: en ? 'Group songs' : 'ผลงานวงล่าสุด',
      releaseLabel: en ? 'Released:' : 'วางจำหน่าย:',
      youtubeBtn: 'YouTube',
      youtubeIconSrc: 'https://cdn.jsdelivr.net/gh/sutfahwa/LYKN_REFLEXION@main/assets/logo-youtube.png',
      officialChannelBtn: en ? 'More songs at LYKN Official' : 'ผลงานเพลงอื่นๆ ที่ LYKN Official',
      officialChannelLink: 'https://www.youtube.com/channel/UCso2wzxEVKV-f4iC3MJrRzA',
      noResults: en ? 'No series or songs found for this member' : 'ไม่พบซีรีย์หรือเพลงของสมาชิกคนนี้'
    },
    admin: {
      title: en ? 'Admin Console' : 'ระบบจัดการหลังบ้าน',
      loginHeading: en ? 'Team Login' : 'เข้าสู่ระบบทีมงาน',
      emailLabel: en ? 'Email' : 'อีเมล',
      passwordLabel: en ? 'Password' : 'รหัสผ่าน',
      loginBtn: en ? 'Log in' : 'เข้าสู่ระบบ',
      loginError: en ? 'Incorrect email or password.' : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      forbidden: en ? "This account doesn't have admin access." : 'บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบจัดการ',
      logoutBtn: en ? 'Log out' : 'ออกจากระบบ',
      tabApprove: en ? 'Approve Tickets' : 'อนุมัติบัตร',
      tabDisputes: en ? 'Disputes' : 'คิวข้อพิพาท',
      searchPlaceholder: en ? 'Search handle, name…' : 'ค้นหา @, ชื่อ...',
      filterAllStatus: en ? 'All statuses' : 'ทุกสถานะ',
      filterDeletedStatus: en ? 'Deleted (log)' : 'ถูกลบ (log)',
      filterAllRounds: en ? 'All shows' : 'ทุกรอบ',
      filterAllEvidence: en ? 'Evidence: any' : 'หลักฐาน: ทั้งหมด',
      filterHasEvidence: en ? 'Has evidence' : 'ส่งหลักฐานแล้ว',
      filterNoEvidence: en ? 'No evidence' : 'ยังไม่ส่งหลักฐาน',
      disputesFilterEvidenceComplete: en ? 'Evidence complete (all sides)' : 'หลักฐานครบทุกฝ่ายแล้ว',
      disputesFilterEvidenceIncomplete: en ? 'Still missing from some side' : 'ยังขาดหลักฐานบางฝ่าย',
      colHandle: en ? 'x.com' : 'account x.com',
      colProfileName: en ? 'Profile name' : 'ชื่อโปรไฟล์',
      colOwnerName: en ? 'Name on ticket' : 'ชื่อบนบัตร',
      colRound: en ? 'Show' : 'รอบ',
      colZone: en ? 'Zone' : 'โซน',
      colRow: en ? 'Row' : 'แถว',
      colSeat: en ? 'Seat' : 'เลขที่นั่ง',
      colRegisteredAt: en ? 'Registered' : 'ลงทะเบียนเมื่อ',
      colTimeLeft: en ? 'Time left' : 'เวลาคงเหลือ',
      deadlineOverdue: en ? 'Overdue' : 'เกินกำหนด',
      hoursUnit: en ? 'h' : 'ชม.',
      minutesUnit: en ? 'm' : 'นาที',
      colEvidence: en ? 'Evidence' : 'หลักฐาน',
      colStatus: en ? 'Status' : 'สถานะ',
      colActions: en ? 'Actions' : 'จัดการ',
      viewDocsBtn: en ? 'View docs' : 'ดูเอกสาร',
      noEvidenceLabel: en ? 'Not submitted' : 'ยังไม่ส่ง',
      approveBtn: en ? 'Approve' : 'อนุมัติ',
      approveConfirmTitle: en ? 'Review this document' : 'พิจารณาเอกสารนี้',
      approveConfirmBody: en
        ? 'Approve marks the seat as verified. Reject requires a reason, and the claimant will see it — they can still edit or resubmit evidence afterward.'
        : 'อนุมัติ = เปลี่ยนสถานะที่นั่งนี้เป็น "ยืนยันแล้ว" · ปฏิเสธ = ต้องระบุเหตุผล ผู้ใช้จะเห็นเหตุผลนี้ และยังแก้ไข/ส่งหลักฐานใหม่ได้',
      rejectClaimBtn: en ? 'Reject' : 'ปฏิเสธ',
      rejectClaimReasonLabel: en ? 'Reason (shown to the claimant, required)' : 'เหตุผล (ผู้ใช้จะเห็น จำเป็นต้องกรอก)',
      confirmRejectBtn: en ? 'Confirm reject' : 'ยืนยันปฏิเสธ',
      backBtn: en ? 'Back' : 'ย้อนกลับ',
      approveNoEvidenceWarning: en
        ? 'This claim has not submitted any evidence yet. Are you sure you want to approve it anyway?'
        : 'รายการนี้ยังไม่มีการส่งหลักฐาน แน่ใจหรือไม่ว่าต้องการอนุมัติเลย',
      approveRejectedEvidenceWarning: en
        ? 'This document was already reviewed and rejected. Approving now will override that decision — make sure you have confirmed the ownership another way (e.g. discussed off-platform).'
        : 'เอกสารของรายการนี้เคยถูกตรวจแล้วว่า "ไม่ผ่าน" — การอนุมัติตอนนี้จะทับผลตรวจเดิม กรุณายืนยันความเป็นเจ้าของด้วยวิธีอื่นแล้ว (เช่น คุยนอกรอบ) ก่อนกดอนุมัติ',
      approveRejectedEvidenceReasonLabel: en ? 'Previous rejection reason' : 'เหตุผลที่ไม่ผ่านครั้งก่อน',
      reloadBtn: en ? 'Reload' : 'รีเฟรช',
      pageLabel: en ? 'Page' : 'หน้า',
      pageSizeLabel: en ? 'Per page' : 'ต่อหน้า',
      prevPageBtn: en ? '‹ Prev' : '‹ ก่อนหน้า',
      nextPageBtn: en ? 'Next ›' : 'ถัดไป ›',
      changeStatusBtn: en ? 'Change Status' : 'เปลี่ยนสถานะ',
      noResultsRow: en ? 'No matching claims' : 'ไม่พบข้อมูลที่ตรงเงื่อนไข',
      deletedStatusLabel: en ? 'Deleted' : 'ถูกลบ',
      deletedInfoAt: en ? 'Deleted at' : 'ลบเมื่อ',
      deletedInfoBy: en ? 'Deleted by' : 'ลบโดย',
      deletedInfoReason: en ? 'Reason' : 'เหตุผล',
      deletedInfoNoReason: en ? 'No reason given' : 'ไม่ระบุเหตุผล',
      changeStatusTitle: en ? 'Change Status' : 'เปลี่ยนสถานะที่นั่ง',
      adminNoteLabel: en ? 'Admin note' : 'บันทึกของแอดมิน',
      changeStatusReasonLabel: en ? 'Reason (shown to the claimant, required)' : 'เหตุผล (ผู้ใช้จะเห็น จำเป็นต้องกรอก)',
      saveBtn: en ? 'Save' : 'บันทึก',
      cancelBtn: en ? 'Cancel' : 'ยกเลิก',
      evidenceDocsTitle: en ? 'Evidence Files' : 'ไฟล์หลักฐาน',
      evidenceOpenBtn: en ? 'Open' : 'เปิดดู',
      evidenceDeletedNote: en ? 'Files are deleted immediately after review — this shows the review result only.' : 'ไฟล์ถูกลบทันทีหลังตรวจ แสดงแค่ผลตรวจสอบเท่านั้น',
      evidenceApproveBtn: en ? 'Approve' : 'ผ่าน',
      evidenceRejectBtn: en ? 'Reject' : 'ไม่ผ่าน',
      evidenceRejectReasonLabel: en ? 'Reason (required)' : 'เหตุผล (จำเป็นต้องกรอก)',
      reasonRequiredError: en ? 'Please enter a reason.' : 'กรุณาระบุเหตุผล',
      resolveTargetRequiredError: en ? 'Please select a claimant.' : 'กรุณาเลือกผู้อ้างสิทธิ์',
      noDisputes: en ? 'No disputes' : 'ไม่มีข้อพิพาทอยู่ในคิว',
      disputeClaimant: en ? 'Claimant' : 'ผู้อ้างสิทธิ์',
      colOpenedAt: en ? 'Opened' : 'เวลาเปิดข้อพิพาท',
      resolveBtn: en ? 'Resolve' : 'ตัดสินเคส',
      resolveTitle: en ? 'Resolve Dispute' : 'ตัดสินเคสข้อพิพาท',
      outcomeLabel: en ? 'Outcome' : 'ผลตัดสิน',
      winningClaimLabel: en ? 'Confirmed owner (winning claimant)' : 'ผู้ชนะ (เจ้าของที่ยืนยัน)',
      falseClaimLabel: en ? 'False claimant to remove' : 'ผู้อ้างสิทธิ์เท็จที่จะลบออก',

      tabUsers: en ? 'User Management' : 'จัดการผู้ใช้',
      usersLoadError: en ? 'Failed to load users' : 'โหลดรายชื่อผู้ใช้ไม่สำเร็จ',
      usersSearchPlaceholder: en ? 'Search email, name, handle…' : 'ค้นหาอีเมล, ชื่อ, @...',
      colEmail: en ? 'Email' : 'อีเมล',
      colDateTime: en ? 'Date/time' : 'วันเวลา',
      colXHandle: en ? 'x.com' : 'account x.com',
      colCreatedAt: en ? 'Joined' : 'สมัครเมื่อ',
      colUserStatus: en ? 'Status' : 'สถานะ',
      colSignupChannel: en ? 'Signed up via' : 'ช่องทางสมัคร',
      signupChannelX: en ? 'x.com' : 'x.com',
      signupChannelEmail: en ? 'Email' : 'อีเมล',
      userStatusActive: en ? 'Active' : 'ใช้งานปกติ',
      userStatusDeactivated: en ? 'Deactivated' : 'ปิดใช้งาน',
      userStatusAdmin: en ? 'Admin' : 'แอดมิน',
      userStatusSelfDeletedData: en ? 'Deleted own data' : 'ลบข้อมูลโดยผู้ใช้เอง',
      deactivateBtn: en ? 'Deactivate' : 'ปิดใช้งาน',
      reactivateBtn: en ? 'Reactivate' : 'เปิดใช้งานคืน',
      sendResetBtn: en ? 'Send password reset' : 'ส่งอีเมลรีเซ็ตรหัสผ่าน',
      deleteUserBtn: en ? 'Delete' : 'ลบถาวร',
      resetSentToast: en ? 'Password reset email sent.' : 'ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว',
      deactivateConfirmTitle: en ? 'Deactivate this user?' : 'ปิดใช้งานผู้ใช้นี้?',
      deactivateConfirmBody: en
        ? 'This user will no longer be able to log in. Their registered seats are not affected.'
        : 'ผู้ใช้นี้จะเข้าสู่ระบบไม่ได้อีก แต่บัตรที่ลงทะเบียนไว้จะไม่มีผลกระทบใดๆ',
      reactivateConfirmTitle: en ? 'Reactivate this user?' : 'เปิดใช้งานผู้ใช้นี้คืน?',
      reactivateConfirmBody: en
        ? 'This user will be able to log in again.'
        : 'ผู้ใช้นี้จะกลับมาเข้าสู่ระบบได้ตามปกติ',
      deleteUserConfirmTitle: en ? 'Permanently delete this user?' : 'ลบผู้ใช้นี้ถาวร?',
      deleteUserConfirmBody: en
        ? 'This permanently deletes the account and ALL of their registered seats/evidence. They can sign up again later. This cannot be undone. A log entry is kept.'
        : 'จะลบบัญชีนี้ถาวร พร้อมบัตร/หลักฐานที่ลงทะเบียนไว้ทั้งหมดของผู้ใช้นี้ สมัครใหม่ได้ภายหลัง การกระทำนี้ย้อนกลับไม่ได้ (ระบบจะเก็บ log ไว้)',
      deleteUserReasonLabel: en ? 'Reason (optional)' : 'เหตุผล (ไม่บังคับ)',
      deleteUserHasDisputeError: en
        ? "Can't delete — this user has a seat currently under dispute review. Resolve it first."
        : 'ลบไม่ได้ เพราะผู้ใช้นี้มีบัตรที่กำลังอยู่ระหว่างข้อพิพาท กรุณาตัดสินเคสก่อน',
      confirmBtn: en ? 'Confirm' : 'ยืนยัน',
      noUsersFound: en ? 'No matching users' : 'ไม่พบผู้ใช้ที่ตรงเงื่อนไข',
      userLogTitle: en ? 'User Management Log' : 'ประวัติการจัดการผู้ใช้',
      userLogEmpty: en ? 'No actions yet' : 'ยังไม่มีประวัติ',
      logActionDelete: en ? 'Deleted' : 'ลบถาวร',
      logActionDeactivate: en ? 'Deactivated' : 'ปิดใช้งาน',
      logActionReactivate: en ? 'Reactivated' : 'เปิดใช้งานคืน',
      logActionResetSent: en ? 'Password reset sent' : 'ส่งรีเซ็ตรหัสผ่าน',
      logActionSelfDeleteData: en ? 'User deleted own data' : 'ผู้ใช้ลบข้อมูลของตัวเอง',
      logByLabel: en ? 'by' : 'โดย',
      claimLogSeatLabel: en ? 'Seat: ' : 'ที่นั่ง: ',

      tabAnnouncements: en ? 'Announcements' : 'ประกาศ',
      announceTitleLabel: en ? 'Title' : 'หัวข้อ',
      announceTitlePlaceholder: en ? 'e.g. Ticket queue opens 10:00' : 'เช่น เปิดคิวจองบัตร 10:00 น.',
      announceBodyLabel: en ? 'Message' : 'ข้อความ',
      announceBodyPlaceholder: en ? 'Short message shown in the notification list' : 'ข้อความสั้นๆ ที่จะโชว์ในกล่องแจ้งเตือน',
      announceClickableLabel: en
        ? 'Make this clickable (opens a popup with more detail)'
        : 'เปิดให้กดดูรายละเอียดเพิ่มเติม (กดแล้วเปิด popup)',
      announceDetailLabel: en ? 'Detail (shown in the popup)' : 'รายละเอียด (แสดงใน popup ตอนกด)',
      announceDetailPlaceholder: en ? 'Full detail text…' : 'เนื้อหารายละเอียดเต็มๆ...',
      announcePublishBtn: en ? 'Publish announcement' : 'เผยแพร่ประกาศ',
      announcePublishing: en ? 'Publishing…' : 'กำลังเผยแพร่...',
      announceMissingFields: en ? 'Please fill in the title and message.' : 'กรุณากรอกหัวข้อและข้อความ',
      announceMissingDetail: en ? 'Please fill in the detail text.' : 'กรุณากรอกรายละเอียด',
      announceSendError: en ? 'Failed to publish. Please try again.' : 'เผยแพร่ไม่สำเร็จ กรุณาลองใหม่',
      announceSendSuccess: en ? 'Announcement published to everyone.' : 'เผยแพร่ประกาศถึงทุกคนแล้ว',
      announceNote: en
        ? 'This is sent to everyone on the site immediately, including visitors who are not logged in.'
        : 'ประกาศนี้จะส่งถึงทุกคนบนเว็บทันที รวมถึงคนที่ยังไม่ได้ login ด้วย',

      announceListHeading: en ? 'Sent Announcements' : 'ประกาศที่เคยส่ง',
      announceListEmpty: en ? 'No announcements yet' : 'ยังไม่มีประกาศ',
      announceClickableTag: en ? 'Clickable' : 'กดได้',
      announceEditBtn: en ? 'Edit' : 'แก้ไข',
      announceDeleteBtn: en ? 'Delete' : 'ลบ',
      announceDeleteConfirm: en ? 'Delete this announcement? This cannot be undone.' : 'ต้องการลบประกาศนี้ใช่หรือไม่? กู้คืนไม่ได้',
      announceEditingHeading: en ? 'Editing announcement' : 'กำลังแก้ไขประกาศ',
      announceSaveBtn: en ? 'Save changes' : 'บันทึกการแก้ไข',
      announceSaving: en ? 'Saving…' : 'กำลังบันทึก...',
      announceCancelEditBtn: en ? 'Cancel' : 'ยกเลิก',
      announceDeleteError: en ? 'Failed to delete. Please try again.' : 'ลบไม่สำเร็จ กรุณาลองใหม่',
      announceEditError: en ? 'Failed to save. Please try again.' : 'บันทึกไม่สำเร็จ กรุณาลองใหม่',

      disputedStatusLabel: en ? 'Disputed' : 'มีข้อพิพาท',
      awaitingEvidenceReviewLabel: en ? 'Awaiting document review' : 'รอตรวจสอบหลักฐาน',
      evidenceRejectedStatusLabel: en ? 'Failed document review' : 'ไม่ผ่านการตรวจสอบเอกสาร',
      caseLabel: en ? 'Case ID' : 'Case ID',
      manageDisputeBtn: en ? 'Manage dispute' : 'จัดการข้อพิพาท',
      viewDetailsBtn: en ? 'View details' : 'ดูรายละเอียด',
      disputeRefLabel: en ? 'Conflicts with' : 'อ้างอิงกับ',
      bothMustSubmitEvidenceError: en
        ? 'Both parties must submit evidence before this dispute can be resolved.'
        : 'ต้องรอให้ทั้งสองฝ่ายส่งหลักฐานก่อน จึงจะตัดสินเคสนี้ได้',
      genericSaveError: en ? 'Failed to save. Please try again.' : 'บันทึกไม่สำเร็จ กรุณาลองใหม่',
      claimDetailsTitle: en ? 'Claim Details & Log' : 'รายละเอียด / ประวัติการดำเนินการ',
      loadingLabel: en ? 'Working…' : 'กำลังดำเนินการ...',
      noLogRows: en ? 'No log entries yet' : 'ยังไม่มีประวัติการดำเนินการ',
      closeBtn: en ? 'Close' : 'ปิด',
      logAction: {
        SET_CLAIM_STATUS: en ? 'Changed claim status' : 'เปลี่ยนสถานะบัตร',
        REVIEW_EVIDENCE: en ? 'Reviewed evidence' : 'ตรวจหลักฐาน',
        RESOLVE_REVIEW: en ? 'Resolved dispute' : 'ตัดสินข้อพิพาท',
        REQUEST_EVIDENCE: en ? 'Requested more evidence' : 'ขอหลักฐานเพิ่มเติม',
        REGISTER_CLAIM: en ? 'Registered seat' : 'ลงทะเบียนบัตร',
        EDIT_CLAIM: en ? 'Edited seat info' : 'แก้ไขข้อมูลบัตร',
        DELETE_CLAIM: en ? 'Deleted claim' : 'ลบบัตร',
        SUBMIT_EVIDENCE: en ? 'Submitted evidence' : 'ส่งหลักฐาน',
        DISPUTE_OPENED: en ? 'Dispute opened' : 'มีข้อพิพาทเกิดขึ้น',
        REJECT_CLAIM_EVIDENCE: en ? 'Evidence rejected' : 'หลักฐานไม่ผ่านการตรวจสอบ'
      },
      requestEvidenceTitle: en ? 'Request More Evidence' : 'ขอหลักฐานเพิ่มเติม',
      requestEvidenceNoteLabel: en
        ? 'Note to this claimant (what you need from them)'
        : 'ระบุสิ่งที่ต้องการให้ส่งเพิ่ม (จะแจ้งไปยังผู้อ้างสิทธิ์รายนี้)',
      requestEvidenceBtn: en ? 'Send request' : 'ส่งคำขอ',
      disputesSearchPlaceholder: en ? 'Search by seat or claimant…' : 'ค้นหาที่นั่งหรือผู้อ้างสิทธิ์...',
      evidenceRequestedTag: en ? 'More requested' : 'ขอเพิ่มแล้ว',
      alertOkBtn: en ? 'OK' : 'ตกลง',
      evidenceFileNotFoundTitle: en ? 'File Not Found' : 'ไฟล์หลักฐาน',
      evidenceFileNotFoundBody: en
        ? 'This evidence file has already been deleted from storage (files are auto-deleted once reviewed/the case is closed) — only the review result remains in the history.'
        : 'ไฟล์หลักฐานนี้ถูกลบออกจากระบบไปแล้ว (ไฟล์จะถูกลบอัตโนมัติหลังตรวจ/ตัดสินเคสเสร็จ) เหลือแค่ผลตรวจไว้ในประวัติเท่านั้น'
    },
    profile: {
      title: en ? 'My Profile' : 'โปรไฟล์ของฉัน',
      loginHeading: en ? 'Register and check seat ownership' : 'ลงทะเบียนและตรวจสอบความเป็นเจ้าของที่นั่ง',
      loginHeroHeadline: en ? 'Join the wolf gang 🐺' : 'มาเป็นส่วนหนึ่งของแก๊งหมาป่ากัน 🐺',
      loginBody: en
        ? 'Sign in with your x.com account to register your seat and manage your tickets.'
        : 'เข้าสู่ระบบด้วยบัญชี x.com เพื่อลงทะเบียนที่นั่ง และจัดการบัตรของคุณ',
      loginBtn: en ? 'Sign in with x.com' : 'เข้าสู่ระบบด้วย x.com',
      loginError: en ? 'Sign-in failed. Please try again.' : 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
      xHandleSetupLabel: en
        ? 'fill your account x.com handle (buyers will check against this)'
        : 'กรอก account x.com ของคุณ (ผู้ซื้อจะเช็คความถูกต้องกับค่านี้)',
      xHandleSetupHint: en
        ? 'You can set this only once — it locks after saving, so double-check it\'s correct.'
        : 'ตั้งค่านี้ได้ครั้งเดียวเท่านั้น — หลังบันทึกแล้วจะแก้ไขไม่ได้อีก กรุณาตรวจสอบให้ถูกต้องก่อนกด',
      xHandleSetBtn: en ? 'Verify your X account (cannot be changed later)' : 'ยืนยัน x account ของคุณ (แก้ไขภายหลังไม่ได้)',
      xHandleSetBtnNote: en
        ? 'This only verifies your account x.com handle — it does not save the rest of your profile. Use the Save button below for that.'
        : 'ปุ่มนี้ยืนยันเฉพาะ account x.com เท่านั้น ไม่ได้บันทึกข้อมูลส่วนอื่นของโปรไฟล์ ต้องกด "บันทึก" ด้านล่างแยกต่างหาก',
      xHandleAlreadySetLabel: en ? 'Your account x.com handle (locked)' : 'account x.com ของคุณ (ล็อกไว้แล้ว)',
      xHandleConfirmTitle: en ? 'Confirm your X account' : 'ยืนยัน x account ของคุณ',
      xHandleConfirmBody: en
        ? 'Once saved, this handle can never be changed again — it will be permanently tied to your account. Please make sure it is spelled correctly.'
        : 'เมื่อบันทึกแล้ว จะไม่สามารถแก้ไข account x.com นี้ได้อีกเลย เพราะจะผูกกับบัญชีนี้ถาวร กรุณาตรวจสอบว่าสะกดถูกต้องก่อนยืนยัน',
      xHandleConfirmBtn: en ? 'Yes, this is correct' : 'ใช่ ถูกต้องแล้ว',
      xHandleTakenError: en
        ? 'This handle is already linked to another account on this system. Please check that it\'s really yours.'
        : 'account x.com นี้ถูกผูกกับอีกบัญชีหนึ่งในระบบนี้ไปแล้ว กรุณาตรวจสอบว่าเป็น account x.com ของคุณจริง',
      xHandleAlreadySetError: en
        ? 'Your handle is already set and locked.'
        : 'account x.com ของคุณถูกตั้งค่าและล็อกไว้แล้ว',
      xHandleInvalidFormatError: en
        ? 'Invalid handle format (1-15 letters, numbers, or underscore only).'
        : 'รูปแบบ @ ไม่ถูกต้อง (ตัวอักษร ตัวเลข หรือ _ เท่านั้น ไม่เกิน 15 ตัว)',
      registerNeedsXHandle: en
        ? 'Please set your account x.com handle in Edit Profile before registering a seat.'
        : 'กรุณาตั้งค่า account x.com ของคุณที่หน้า "แก้ไขโปรไฟล์" ก่อนลงทะเบียนที่นั่ง',
      goToEditProfileBtn: en ? 'Go to Edit Profile' : 'ไปที่แก้ไขโปรไฟล์',
      xHandleRequiredLabel: en
        ? 'your account x.com handle (required, so buyers can verify you)'
        : 'account x.com ของคุณ (จำเป็นต้องกรอก เพื่อให้ผู้ซื้อตรวจสอบได้)',
      xHandleRequiredPlaceholder: en ? 'handle' : 'handle',
      xHandleNoAtHint: en ? "No need to type @ — it's already there." : 'ไม่ต้องพิมพ์ @ นำหน้า ระบบใส่ให้แล้ว',
      logoutBtn: en ? 'Log out' : 'ออกจากระบบ',
      logoutConfirmTitle: en ? 'Log out?' : 'ออกจากระบบ?',
      logoutConfirmBody: en ? "You'll need to sign in with x.com again to manage your seats." : 'คุณจะต้องเข้าสู่ระบบด้วย x.com ใหม่อีกครั้งเพื่อจัดการที่นั่งของคุณ',
      logoutConfirmBodyEmail: en ? "You'll need to sign in with your email again to manage your seats." : 'คุณจะต้องเข้าสู่ระบบด้วยอีเมลใหม่อีกครั้งเพื่อจัดการที่นั่งของคุณ',

      setupHeading: en ? "Let's set up your profile" : 'ตั้งค่าโปรไฟล์ของคุณก่อนเริ่มใช้งาน',
      setupBody: en ? 'This is shown only to you — it never replaces your x.com identity.' : 'ใช้แสดงเฉพาะฝั่งคุณเห็นเอง ไม่ได้แทนที่ตัวตนบน x.com ของคุณ',
      // ลงทะเบียนด้วยอีเมลไม่มีบัญชี x.com ผูกอยู่ ตัดประโยค "ไม่ได้แทนที่ตัวตน
      // บน x.com" ออก เพราะไม่เกี่ยวกับ flow นี้
      setupBodyEmail: en ? 'This is shown only to you.' : 'ใช้แสดงเฉพาะฝั่งคุณเห็นเองเท่านั้น',
      setupNameLabel: en ? 'Display name' : 'ชื่อที่ใช้แสดง',
      setupNamePlaceholder: en ? 'e.g. Fah' : 'ชื่อที่กรอกจะนำไปแสดงในระบบ',
      setupEmojiLabel: en ? 'Choose an avatar' : 'เลือกอวาตาร์',
      setupBgLabel: en ? 'Choose a background color' : 'เลือกสีพื้นหลัง',
      setupTermsLabel: en ? 'I have read and accept the Terms & Conditions' : 'ฉันอ่านและยอมรับข้อกำหนดและเงื่อนไขแล้ว',
      setupSubmitBtn: en ? 'Get started' : 'เริ่มใช้งาน',
      setupIncomplete: en ? 'Please enter a display name and accept the terms.' : 'กรุณากรอกชื่อที่ใช้แสดง และยอมรับข้อกำหนดก่อน',

      tabRegister: en ? 'Register a Seat' : 'ลงทะเบียนบัตร',
      tabManageTickets: en ? 'Manage Tickets' : 'จัดการบัตร',
      tabMyTickets: en ? 'My Tickets' : 'บัตรของฉัน',
      tabMyCases: en ? 'My Cases' : 'เคสของฉัน',
      subTabMyTickets: en ? 'Manage My Tickets' : 'จัดการบัตรของฉัน',
      subTabDisputes: en ? 'Manage Disputes' : 'จัดการข้อพิพาท',
      disputesTooltipText: en
        ? '"Dispute" = more than one person registered the same seat as theirs. The team opens a case and compares evidence from both sides to decide who the real owner is — neither side ever sees who the other is.'
        : '"ข้อพิพาท" คือ กรณีที่มีคนมากกว่า 1 คนลงทะเบียนอ้างสิทธิ์ที่นั่งเดียวกัน ระบบจะเปิดเป็นเคสให้ทีมงานเปรียบเทียบหลักฐานของทั้งสองฝ่าย แล้วตัดสินว่าใครคือเจ้าของตัวจริง — ทั้งสองฝ่ายจะไม่เห็นตัวตนกันและกันตลอดกระบวนการ',
      tabHowto: en ? 'How It Works & Limits' : 'วิธีใช้และข้อจำกัด',
      tabEditProfile: en ? 'Edit Profile' : 'แก้ไขโปรไฟล์',
      seatCountUnit: en ? 'seats' : 'ที่นั่ง',
      helloGreeting: en ? 'Hello,' : 'สวัสดี',
      seatsRegisteredPrefix: en ? 'You have' : 'มีที่นั่งที่ลงทะเบียนไว้',
      seatsRegisteredSuffix: en ? 'seat(s) registered' : 'ที่นั่ง',

      registerHeading: en ? 'Register Your Seat' : 'ลงทะเบียนที่นั่งของคุณ',
      registerBody: en
        ? "Only register a seat that's genuinely yours. Your x.com handle below comes from your login and can't be edited here."
        : 'ลงทะเบียนเฉพาะที่นั่งที่เป็นของคุณจริงเท่านั้น account x.com ด้านล่างดึงมาจากบัญชีที่ login ไว้ แก้ไขตรงนี้ไม่ได้',
      registerBodyEmail: en
        ? "Only register a seat that's genuinely yours. Since you signed in with email, enter your x.com handle below yourself — buyers will check against it."
        : 'ลงทะเบียนเฉพาะที่นั่งที่เป็นของคุณจริงเท่านั้น เนื่องจากคุณ login ด้วยอีเมล กรุณากรอก account x.com ของคุณเองด้านล่าง ผู้ซื้อจะเช็คความถูกต้องกับค่านี้',
      ownerNameLabel: en ? "Name on ticket (optional)" : 'ชื่อบนบัตร (ไม่บังคับ)',
      ownerNamePlaceholder: en ? 'Optional' : 'ไม่บังคับ',
      xHandleReadonlyLabel: en ? "Your x.com handle (from login)" : 'account x.com ของคุณ (จากการ login)',
      check1Label: en
        ? 'I confirm this is genuinely my own ticket. Filing a false claim results in a permanent ban.'
        : 'ฉันยืนยันว่านี่คือบัตรของฉันจริง การแอบอ้างสิทธิ์เท็จมีโทษระงับบัญชีถาวร',
      check2Label: en
        ? 'I accept the Terms & Privacy Policy, and understand my data is deleted within 7 days of the concert.'
        : 'ฉันยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว และเข้าใจว่าข้อมูลจะถูกลบภายใน 7 วันหลังคอนเสิร์ต',
      registerSubmitBtn: en ? 'Register Seat' : 'ลงทะเบียนที่นั่ง',
      registerSubmitBtnLoading: en ? 'Registering…' : 'กำลังลงทะเบียน...',
      registerIncomplete: en ? 'Please fill in the seat details and check both boxes.' : 'กรุณากรอกข้อมูลที่นั่งให้ครบ และติ๊กถูกทั้งสองข้อ',
      fieldRequired: en ? 'This field is required.' : 'จำเป็นต้องกรอกช่องนี้',
      checkboxRequired: en ? 'Please check this box.' : 'กรุณาติ๊กถูกข้อนี้',
      registerEvidenceHint: en
        ? "Submitting evidence is optional, but if someone else registers this seat and their evidence is approved first, it won't be confirmed under your name — first-verified wins, not first-registered."
        : 'การส่งหลักฐานเป็นเพียงทางเลือกหนึ่งในการยืนยันบัตรเท่านั้น กรณีที่มีคนลงทะเบียนในที่นั่งเดียวกันและมีการยืนยันหลักฐานที่ถูกต้องก่อน ที่นั่งดังกล่าวจะไม่ได้รับการยืนยันในชื่อของคุณ',
      registerSuccessTitle: en ? 'Registered!' : 'ลงทะเบียนสำเร็จ!',
      registerSuccessBody: en ? 'Want to speed up verification? Submit evidence now from the "My Tickets" tab.' : 'คุณสามารถอัปโหลดเอกสารเพื่อยืนยันที่นั่งนี้ได้ ที่เมนู "จัดการบัตร > จัดการบัตรของฉัน"',
      registerConflictTitle: en ? 'This seat already has a claim' : 'ที่นั่งนี้มีผู้ลงทะเบียนไว้แล้ว',
      registerConflictBody: en
        ? "Our team will review the dispute within 48 hours. You can upload more evidence any time from the Manage Disputes tab."
        : 'ทีมงานจะทำการตรวจสอบข้อพิพาทให้ภายใน 48 ชั่วโมง คุณสามารถอัปโหลดเอกสารยื่นยันตัวตนได้เพิ่มเติมที่หน้าจัดการข้อพิพาท',
      cooldownError: en ? "This seat was just removed — it's in a 15-minute cooldown before it can be registered again." : 'ที่นั่งนี้เพิ่งถูกลบไป ต้องรอ 15 นาทีก่อนลงทะเบียนใหม่ได้',
      seatActionRateLimited: en
        ? "You've registered or edited seats too many times today (max 20/day). Please try again tomorrow, or contact our team if you need to register more urgently."
        : 'วันนี้คุณลงทะเบียน/แก้ไขที่นั่งไปหลายครั้งเกินไปแล้ว (สูงสุด 20 ครั้ง/วัน) กรุณาลองใหม่พรุ่งนี้ หรือติดต่อทีมงานหากจำเป็นต้องลงทะเบียนเพิ่มด่วน',
      selfDuplicateError: en
        ? 'You already have this seat registered. To edit the registration or upload evidence, manage it from the "My Tickets" menu.'
        : 'คุณลงทะเบียนที่นั่งนี้ไว้อยู่แล้ว ถ้าต้องการแก้ไขการลงทะเบียน หรืออัปโหลดเอกสารเพื่อยืนยันบัตร โปรดจัดการที่เมนู "บัตรของฉัน"',
      seatNotOnMapError: en ? 'This seat does not exist on the venue map. Please check the zone/row/seat number again.' : 'ที่นั่งนี้ไม่มีอยู่จริงในผังที่นั่ง กรุณาตรวจสอบโซน/แถว/เลขที่นั่งอีกครั้ง',
      seatRegistrationBlockedError: en
        ? "This seat can't be registered under your account — our team already determined this registration was incorrect."
        : 'ที่นั่งนี้ไม่สามารถลงทะเบียนด้วยบัญชีของคุณได้ เนื่องจากทีมงานตัดสินไปแล้วว่าการลงทะเบียนนี้ไม่ถูกต้อง',
      registeredTooltipGeneric: en
        ? 'Submit evidence to confirm you own this seat — once approved, it will be verified.'
        : 'ส่งหลักฐานเพื่อยืนยันว่าที่นั่งนี้เป็นของคุณ ถ้าผ่านการตรวจสอบ ที่นั่งนี้จะได้รับการยืนยัน',
      dupConfirmTitle: en ? 'This seat is already registered' : 'ที่นั่งนี้มีผู้ลงทะเบียนแล้ว',
      dupConfirmBody: en
        ? 'If this ticket is really yours, you can file it for our team to review by clicking "Yes, this is my seat".'
        : 'ในกรณีที่บัตรนี้เป็นของคุณ คุณสามารถส่งเรื่องเพื่อให้ทีมงานตรวจสอบ โดยคลิกที่ปุ่ม "ใช่ นี่คือที่นั่งของฉัน"',
      dupConfirmContinueBtn: en ? 'Yes, this is my seat' : 'ใช่ นี่คือที่นั่งของฉัน',
      alertOkBtn: en ? 'OK' : 'ตกลง',
      goToManageTicketsBtn: en ? 'Go to My Tickets' : 'ไปที่หน้าจัดการบัตรของฉัน',
      goToDisputesBtn: en ? 'Go to Manage Disputes' : 'ไปที่จัดการข้อพิพาท',

      myTicketsEmpty: en ? "You haven't registered any seats yet." : 'คุณยังไม่ได้ลงทะเบียนที่นั่งใด ๆ',
      myTicketsEmptyCta: en ? 'Register your first seat' : 'ลงทะเบียนที่นั่งแรกของคุณ',
      loadErrorMsg: en ? 'Could not load your data. Please try again.' : 'โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
      retryBtn: en ? 'Try again' : 'ลองใหม่',
      refreshBtn: en ? 'Refresh' : 'รีเฟรช',
      registeredAtLabel: en ? 'Registered' : 'ลงทะเบียนเมื่อ',
      checkedCountLabel: en ? 'Checked' : 'ถูกตรวจสอบ',
      checkedCountUnit: en ? 'times' : 'ครั้ง',
      editBtn: en ? 'Edit' : 'แก้ไข',
      deleteBtn: en ? 'Delete' : 'ลบ',
      editWarningTitle: en ? 'This seat is already verified' : 'ที่นั่งนี้ยืนยันแล้ว',
      editWarningBody: en
        ? 'Editing a verified seat resets its status back to "awaiting evidence" — you will need to be re-verified.'
        : 'การแก้ไขที่นั่งที่ยืนยันแล้ว จะทำให้สถานะกลับไปเป็น "รอยืนยันหลักฐาน" ซึ่งจะต้องรอตรวจสอบใหม่อีกครั้ง',
      editWarningContinueBtn: en ? 'Continue to edit' : 'ดำเนินการแก้ไขต่อ',
      editWarningPendingEvidenceTitle: en ? 'You have evidence awaiting review' : 'คุณมีหลักฐานรอตรวจสอบอยู่',
      editWarningPendingEvidenceBody: en
        ? "You've already submitted evidence for this seat and it's awaiting review. Editing the seat details may make that evidence no longer match — we recommend submitting evidence again after you finish editing."
        : 'คุณส่งหลักฐานของที่นั่งนี้ไปแล้ว ซึ่งในขณะนี้อยู่ระหว่างการตรวจสอบ หากต้องการแก้ไขข้อมูลใหม่อีกครั้ง แนะนำให้ส่งหลักฐานที่สอดคล้องกับข้อมูลใหม่อีกครั้ง',
      editFormHeading: en ? 'Edit Seat' : 'แก้ไขที่นั่ง',
      editSubmitBtn: en ? 'Save Changes' : 'บันทึกการแก้ไข',
      editSubmitBtnLoading: en ? 'Saving…' : 'กำลังบันทึก...',
      submitEvidenceBtn: en ? 'Submit Evidence' : 'ส่งหลักฐาน',
      comingSoon: en ? 'Coming soon' : 'เร็วๆ นี้',
      disputedBanner: en
        ? 'This seat is under review because more than one person has claimed it.'
        : 'ที่นั่งนี้อยู่ระหว่างการตรวจสอบ เนื่องจากมีผู้อ้างสิทธิ์มากกว่าหนึ่งคน',

      deleteConfirmTitle: en ? 'Delete this seat registration?' : 'ยืนยันลบการลงทะเบียนที่นั่งนี้?',
      deleteWarn1: en ? "This seat enters a 15-minute cooldown before anyone (including you) can register it again." : 'ที่นั่งนี้จะเข้าสู่ช่วง cooldown 15 นาที ก่อนจะสามารถเริ่มลงทะเบียนใหม่ได้',
      deleteWarn2: en ? 'Anyone currently checking this seat will now see it as unregistered, and could register it themselves.' : 'ผู้ที่กำลังตรวจสอบที่นั่งนี้อยู่จะเห็นสถานะว่ายังไม่มีผู้ลงทะเบียน และหากครบช่วงเวลา cooldown จะสามารถลงทะเบียนในที่นั่งนี้ได้',
      deleteWarn3: en ? 'Any verified status or submitted evidence for this seat is lost.' : 'เมื่อยืนยันลบการลงทะเบียนที่นั่งนี้ สถานะยืนยันแล้วเดิม รวมถึงหลักฐานที่เคยส่งไว้สำหรับที่นั่งนี้จะหายไปทั้งหมด',
      deleteWarn4: en ? 'This deletion is logged internally, but never shown to other users.' : 'การลบการลงทะเบียนที่นั่งนี้จะถูกบันทึกไว้ภายในระบบเท่านั้น แต่จะไม่แสดงให้ผู้ใช้งานทั่วไปเห็น',
      deleteConfirmBtn: en ? 'Yes, delete it' : 'ยืนยัน ลบเลย',
      deleteCancelBtn: en ? 'Cancel' : 'ยกเลิก',
      underReviewLockedError: en ? "This seat is under review — you can't delete it until the review is resolved." : 'ที่นั่งนี้อยู่ระหว่างตรวจสอบ ลบไม่ได้จนกว่าผลตรวจสอบจะออก',

      myCasesEmpty: en ? "You don't have any open dispute cases." : 'บัตรของคุณไม่มีข้อโต้แย้งใด ๆ อยู่ในระบบ',
      caseSeatLabel: en ? 'Seat' : 'ที่นั่ง',
      caseStatusLabel: en ? 'Status' : 'สถานะ',
      caseOpenedLabel: en ? 'Opened' : 'เปิดเมื่อ',
      caseOutcomeWinTag: en ? 'Confirmed as yours' : 'บัตรถูกยืนยันว่าเป็นของคุณ',
      caseOutcomeLossTag: en ? 'Confirmed to belong to someone else' : 'บัตรถูกยืนยันเจ้าของเป็นคนอื่นแล้ว',
      caseJudgmentNote: en
        ? "The team's decision is based solely on the evidence submitted. If you have further questions, contact the team at x.com @susakiiverse"
        : 'การตัดสินของทีมงานเป็นการตัดสินจากข้อมูลหลักฐานที่ท่านแนบมาเท่านั้น หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อทีมงานที่ x.com @susakiiverse',
      caseNoAccuseNote: en
        ? "We never reveal who the other claimant is — please don't speculate publicly."
        : 'เราจะไม่เปิดเผยตัวตนของผู้อ้างสิทธิ์อีกฝ่ายเด็ดขาด กรุณาอย่าคาดเดาในที่สาธารณะ',
      caseContactBtn: en ? 'Contact the team' : 'ติดต่อทีมงาน',
      timelineFiled: en ? 'Case filed' : 'เปิดเคส',
      timelineEvidence: en ? 'Evidence window (48h)' : 'ช่วงส่งหลักฐาน (48 ชม.)',
      timelineReview: en ? 'Team review' : 'ทีมงานตรวจสอบ',
      timelineOutcome: en ? 'Outcome' : 'ผลตัดสิน',

      editProfileHeading: en ? 'Edit Profile' : 'แก้ไขโปรไฟล์',
      saveBtn: en ? 'Save' : 'บันทึก',
      deleteMyDataHeading: en ? 'Delete All My Data' : 'ลบข้อมูลของฉันทั้งหมด',
      deleteMyDataBody: en
        ? 'Permanently deletes your profile, seat registrations, evidence, and your account itself. This cannot be undone — you will be signed out, and can sign in again with the same x.com account whenever you like.'
        : 'ลบโปรไฟล์ การลงทะเบียนที่นั่ง หลักฐาน และบัญชีของคุณทั้งหมดอย่างถาวร กู้คืนไม่ได้ — ระบบจะออกจากระบบให้อัตโนมัติ และสามารถเข้าสู่ระบบใหม่ด้วย account x.com เดิมได้เมื่อไหร่ก็ได้',
      deleteMyDataBtn: en ? 'Delete all my data' : 'ลบข้อมูลของฉันทั้งหมด',
      deleteAllHasDisputeError: en
        ? "You have a seat under active dispute — you can't delete all your data until that case is resolved."
        : 'คุณมีที่นั่งที่กำลังอยู่ระหว่างข้อพิพาท ไม่สามารถลบข้อมูลทั้งหมดได้จนกว่าจะได้ผลตัดสิน',

      howtoWhatIsHeading: en ? 'What this is' : 'เครื่องมือนี้คืออะไร',
      howtoWhatIs: en
        ? [
            'A fan-made tool that lets sellers voluntarily register a seat to their x.com account.',
            "Buyers can check whether a seller's handle matches the registration before paying.",
            'Entirely optional and separate from ticket sales — not a marketplace.'
          ]
        : [
            'เครื่องมือที่แฟนคลับทำขึ้น ให้ผู้ขายลงทะเบียนที่นั่งผูกกับบัญชี x.com ของตัวเองโดยสมัครใจ',
            'ผู้ซื้อสามารถเช็คว่า @ ของผู้ขายตรงกับที่ลงทะเบียนไว้หรือไม่ ก่อนโอนเงิน',
            'เป็นฟีเจอร์เสริมที่ไม่บังคับ และแยกจากระบบขายบัตรโดยสิ้นเชิง ไม่ใช่ตลาดซื้อขาย'
          ],
      howtoWhatIsntHeading: en ? "What this isn't" : 'เครื่องมือนี้ไม่ใช่อะไร',
      howtoWhatIsnt: en
        ? [
            "Not affiliated with the organizer, artist, agency, or ticket vendor.",
            "Can't confirm a ticket is authentic or that delivery will happen.",
            "Doesn't support standing / general-admission (no-seat) tickets.",
            "Can't check anything if the seller never registered."
          ]
        : [
            'ไม่มีส่วนเกี่ยวข้องกับผู้จัดงาน ศิลปิน ค่าย หรือผู้ขายบัตร',
            'ไม่สามารถยืนยันความแท้ของบัตร หรือรับประกันว่าจะได้รับบัตรจริง',
            'ไม่รองรับบัตรยืน/ไม่ระบุที่นั่ง',
            'เช็คอะไรไม่ได้เลยถ้าฝั่งผู้ขายไม่เคยลงทะเบียนไว้'
          ],
      howtoHowToHeading: en ? 'How to register your seat' : 'วิธีลงทะเบียนที่นั่ง',
      howtoHowTo: en
        ? [
            'Sign in with your x.com account.',
            'Go to "Register a Seat" and fill in your round, zone, row, and seat number.',
            'Check both boxes confirming it is your own ticket and that you accept the terms.',
            'Optionally submit evidence afterwards to speed up verification.'
          ]
        : [
            'เข้าสู่ระบบด้วยบัญชี x.com',
            'ไปที่แท็บ "ลงทะเบียนบัตร" แล้วกรอกรอบ โซน แถว และเลขที่นั่ง',
            'ติ๊กถูกทั้งสองข้อ ยืนยันว่าเป็นบัตรของตัวเองจริง และยอมรับข้อกำหนด',
            'ส่งหลักฐานเพิ่มเติมได้ (ไม่บังคับ) เพื่อให้ตรวจสอบเร็วขึ้น'
          ],
      howtoStatusHeading: en ? 'What each status means' : 'ความหมายของแต่ละสถานะ',
      howtoCautionHeading: en ? 'Before you buy, be careful' : 'ก่อนซื้อ ควรระวัง',
      howtoCaution: en
        ? [
            'A match doesn\'t guarantee the ticket is real — only that the handle matches what was registered.',
            'Prefer payment methods that offer buyer protection.',
            'Be extra cautious with sellers pushing for urgency or an unusual payment method.',
            'Ask to video call or verify identity through another channel if unsure.'
          ]
        : [
            'ผลตรง ไม่ได้แปลว่าบัตรเป็นของแท้เสมอไป แค่บอกว่า @ ตรงกับที่ลงทะเบียนไว้เท่านั้น',
            'เลือกช่องทางชำระเงินที่มีระบบคุ้มครองผู้ซื้อถ้าเป็นไปได้',
            'ระวังผู้ขายที่เร่งรัดให้โอนเงินเร็วๆ หรือขอวิธีชำระเงินที่ไม่คุ้นเคย',
            'ถ้าไม่มั่นใจ ลองขอวิดีโอคอลหรือยืนยันตัวตนผ่านช่องทางอื่นเพิ่มเติม'
          ],
      dataRetentionNote: en
        ? 'All registration data is permanently deleted within 7 days after the concert.'
        : 'ข้อมูลการลงทะเบียนทั้งหมดจะถูกลบถาวรภายใน 7 วันหลังจบคอนเสิร์ต',

      status: {
        NONE: { label: en ? 'No data' : 'ยังไม่มีข้อมูล', desc: en ? 'No one has registered this seat.' : 'ยังไม่มีใครลงทะเบียนที่นั่งนี้' },
        REGISTERED: { label: en ? 'Awaiting evidence' : 'รอยืนยันหลักฐาน', desc: en ? 'Registered, but evidence has not been reviewed yet.' : 'ลงทะเบียนแล้ว แต่ยังไม่ผ่านการตรวจหลักฐาน' },
        AWAITING_DOC_REVIEW: { label: en ? 'Awaiting document review' : 'รอตรวจสอบเอกสาร', desc: en ? 'Evidence submitted — the team is reviewing it.' : 'ส่งหลักฐานแล้ว กำลังรอทีมงานตรวจสอบ' },
        VERIFIED: { label: en ? 'Verified' : 'ยืนยันแล้ว', desc: en ? 'The team reviewed evidence and confirmed this claim.' : 'ทีมงานตรวจหลักฐานและยืนยันแล้ว' },
        UNDER_REVIEW: { label: en ? 'Under dispute review' : 'อยู่ระหว่างตรวจสอบข้อพิพาท', desc: en ? 'More than one claim — the team is reviewing.' : 'มีผู้อ้างสิทธิ์มากกว่าหนึ่งคน ทีมงานกำลังตรวจสอบ' },
        REJECTED: { label: en ? 'Registration invalid' : 'ข้อมูลลงทะเบียนไม่ถูกต้อง', desc: en ? 'The team reviewed this claim and could not confirm it — see the reason below.' : 'ทีมงานตรวจสอบแล้วไม่สามารถยืนยันสิทธิ์นี้ได้ ดูเหตุผลด้านล่าง' },
        EVIDENCE_REJECTED: { label: en ? 'Failed document review' : 'ไม่ผ่านการตรวจสอบเอกสาร', desc: en ? 'The evidence submitted was not approved — see the reason below. You can edit or submit new evidence to try again.' : 'หลักฐานที่ส่งไปไม่ผ่านการตรวจสอบ ดูเหตุผลด้านล่าง คุณยังแก้ไขหรือส่งหลักฐานใหม่เพื่อลองอีกครั้งได้' }
      },
      rejectedReasonLabel: en ? 'Reason' : 'เหตุผล',
      rejectedReasonFallback: en ? 'No reason was provided.' : 'ไม่มีการระบุเหตุผลเพิ่มเติม',
      reviewOutcome: {
        PENDING: en ? 'Awaiting review' : 'รอตรวจสอบ',
        AWAITING_EVIDENCE: en ? 'Awaiting more evidence' : 'รอหลักฐานเพิ่มเติม',
        OWNER_CONFIRMED: en ? 'Owner confirmed' : 'ยืนยันเจ้าของแล้ว',
        INCONCLUSIVE: en ? 'Inconclusive' : 'หาข้อสรุปไม่ได้',
        FALSE_CLAIM_REMOVED: en ? 'False claim removed' : 'ลบผู้อ้างสิทธิ์เท็จแล้ว'
      },

      termsTitle: en ? 'Terms of Service & Privacy Notice' : 'ข้อกำหนดการใช้งานและคำชี้แจงความเป็นส่วนตัว (Terms of Service & Privacy Notice)',
      termsAcceptBtn: en ? 'Accept' : 'ยอมรับ',
      termsScrollHint: en ? 'Please scroll to the end to accept' : 'กรุณาเลื่อนอ่านจนจบก่อนกดยอมรับ',
      termsCloseBtn: en ? 'Close' : 'ปิด',
      termsIntro: en
        ? 'Please read and understand all terms below before registering.'
        : 'โปรดอ่านและทำความเข้าใจข้อกำหนดทั้งหมดก่อนลงทะเบียนเข้าใช้งาน',
      termsSections: en ? [
        { h: '1. Purpose and nature of the service', b: '• This platform is a free community tool for fans, intended to help match and verify consistency between ticket information and x.com accounts that users voluntarily submit.\n• This service has no relationship with, is not endorsed by, and does not represent the concert organizer, artist, record label/agency, or any official ticket distributor.\n• This platform is not an intermediary, not a marketplace, and not a party to any transaction involving the sale, exchange, or transfer of concert tickets.' },
        { h: '2. Limitation of civil liability', b: '• All information in the system comes from data submitted by users. The platform cannot guarantee the accuracy or authenticity of any ticket, nor the honesty of any claimant.\n• Verification results are preliminary information to assist a decision only — they are not a guarantee that fraud or damage will not occur.\n• The developer and administrators will not be responsible for any financial loss, damage, or civil dispute arising from any transaction or contact between users, in all cases.' },
        { h: '3. User obligations, prohibitions, and legal liability', b: '• Accuracy of information: you must register only a seat you genuinely hold ownership or valid ticket rights to. Submitting false information, impersonating another person\'s claim, or claiming a seat that is not yours carries a penalty of a permanent account ban, and you may be prosecuted under the Computer Crime Act, criminal fraud law, and other related laws.\n• Prohibition on defamation: you must not take verification results, in-system statuses, or screenshots and publish them publicly in a way that shames, targets, defames, or exposes another person to contempt or hatred. Anyone who violates this is fully responsible for the legal consequences (both civil and criminal) themselves.\n• You must not attempt to hack the system or unlawfully collect other users\' personal information.' },
        { h: '4. Collection and protection of personal data (PDPA)', b: 'When you accept and register, the system will collect and process your personal data on the basis of Consent and Legitimate Interest, as follows:\n\nData collected:\n1. Seat information (show round, zone, row, seat number)\n2. x.com account information (Username)\n3. Name (only if you choose to enter it voluntarily)\n4. Date/time the data was recorded, and any evidence image/document file you choose to submit\n5. Technical data: the system does not store your IP address — only a salted hash value, used solely for security and spam prevention\n\nPurpose of use: to verify ownership, check the correctness of seat information, and display a "match / no match" result only.' },
        { h: '5. Evidence review process and dispute resolution', b: '• Evidence review: any document or image evidence you submit is used for review by our team only, and the evidence file is deleted from the system immediately after the review is complete — the system retains only a "passed" or "not passed" status.\n• Duplicate claims (disputes): if more than one user account claims the same seat, the system maintains maximum privacy — neither party can see the identity, personal information, or evidence of the other party. Our team acts as an intermediary to review additional evidence and decide at the team\'s discretion.' },
        { h: '6. Retention period and data subject rights', b: '• Scheduled deletion: all data related to the system (registration data, verification records, disputes, and system logs) will be permanently deleted within 7 days after the end of the concert.\n• Your data rights: you may request to delete or withdraw your own data from the system at any time via the "Edit Profile" menu on the website.' },
        { h: '7. Contact', b: 'For further issues, please contact the team via x.com account: @susakiiverse' }
      ] : [
        { h: '1. วัตถุประสงค์และลักษณะของบริการ', b: '• แพลตฟอร์มนี้เป็นเครื่องมือสนับสนุนชุมชนแฟนคลับ ที่ให้บริการโดยไม่มีค่าใช้จ่าย มีวัตถุประสงค์เพื่ออำนวยความสะดวกในการจับคู่และตรวจสอบความสอดคล้องระหว่างข้อมูลบัตรคอนเสิร์ตกับบัญชี x.com ตามที่ผู้ใช้งานนำเข้าสู่ระบบโดยสมัครใจ\n• บริการนี้ไม่มีส่วนเกี่ยวข้อง ไม่ได้รับการรับรอง และไม่เป็นตัวแทนของผู้จัดงานคอนเสิร์ต ศิลปิน ค่ายเพลง/ต้นสังกัด หรือบริษัทตัวแทนจำหน่ายบัตรอย่างเป็นทางการใด ๆ\n• แพลตฟอร์มนี้ไม่ใช่คนกลาง ไม่ใช่ตลาด และไม่ใช่คู่สัญญาในธุรกรรมการซื้อขาย แลกเปลี่ยน หรือส่งมอบบัตรคอนเสิร์ต' },
        { h: '2. ข้อจำกัดความรับผิดทางแพ่ง', b: '• ข้อมูลทั้งหมดในระบบมาจากการนำเข้าของผู้ใช้งาน แพลตฟอร์มไม่สามารถรับประกัน ความถูกต้อง ความแท้จริงของบัตร หรือความซื่อสัตย์ของผู้อ้างสิทธิ์ได้\n• ผลการตรวจสอบเป็นเพียงข้อมูลประกอบการตัดสินใจเบื้องต้น ไม่ถือเป็นการการันตีว่าจะไม่เกิดการฉ้อโกงหรือความเสียหาย\n• ผู้พัฒนาและผู้ดูแลระบบจะไม่รับผิดชอบต่อความสูญเสีย ความเสียหายทางการเงิน หรือข้อพิพาททางแพ่งใด ๆ ที่เกิดขึ้นจากการทำธุรกรรมหรือการติดต่อระหว่างผู้ใช้งานในทุกกรณี' },
        { h: '3. หน้าที่ของผู้ใช้งาน ข้อห้าม และความรับผิดทางกฎหมาย', b: '• ความถูกต้องของข้อมูล: ผู้ใช้งานต้องลงทะเบียนเฉพาะที่นั่งที่ตนเองมีกรรมสิทธิ์หรือสิทธิ์ตามบัตรจริงเท่านั้น การนำเข้าข้อมูลเท็จ การแอบอ้างสิทธิ์ของผู้อื่น หรือการสวมสิทธิ์ มีโทษระงับบัญชีถาวร และอาจถูกดำเนินคดีตาม พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ฯ และกฎหมายอาญาฐานฉ้อโกง รวมถึงกฎหมายอื่น ๆ ที่เกี่ยวข้อง\n• ข้อห้ามเรื่องการหมิ่นประมาท: ห้ามนำผลการตรวจสอบ สถานะในระบบ หรือแคปภาพหน้าจอไปเผยแพร่ในที่สาธารณะในลักษณะประจาน ชี้เป้า ใส่ความ หรือทำให้ผู้อื่นเสียชื่อเสียง ถูกดูหมิ่น หรือถูกเกลียดชัง ผู้ฝ่าฝืนต้องรับผิดชอบผลทางกฎหมาย (ทั้งทางแพ่งและอาญา) ด้วยตนเองทั้งหมด\n• ห้ามพยายามเจาะระบบ หรือรวบรวมข้อมูลส่วนบุคคลของผู้อื่นโดยมิชอบ' },
        { h: '4. การเก็บรวบรวมและคุ้มครองข้อมูลส่วนบุคคล (PDPA)', b: 'เมื่อคุณกดยอมรับและลงทะเบียน ระบบจะเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลของคุณบนฐานความยินยอม (Consent) และฐานประโยชน์อันชอบธรรม ดังนี้:\n\nข้อมูลที่เก็บรวบรวม:\n1. ข้อมูลที่นั่ง (รอบการแสดง, โซน, แถว, เลขที่นั่ง)\n2. ข้อมูลบัญชี x.com (Username)\n3. ชื่อ (เฉพาะกรณีที่ผู้ใช้เลือกกรอกโดยสมัครใจ)\n4. วันเวลาที่บันทึกข้อมูล และไฟล์ภาพ/เอกสารหลักฐานที่เลือกส่งเข้ามา\n5. ข้อมูลทางเทคนิค: ระบบจะไม่เก็บ IP Address ของคุณ แต่จะเก็บเฉพาะค่า Hash ที่ผ่านการใส่ Salt (Salted Hash) เพื่อความปลอดภัยและการป้องกันสแปมเท่านั้น\n\nวัตถุประสงค์การใช้ข้อมูล: ใช้เพื่อการยืนยันสิทธิ์ ตรวจสอบความถูกต้องของที่นั่ง และแสดงผลสถานะ "ตรงกัน / ไม่ตรงกัน" เท่านั้น' },
        { h: '5. กระบวนการตรวจสอบหลักฐานและกรณีข้อพิพาท', b: '• การตรวจหลักฐาน: เอกสารหรือภาพหลักฐานที่คุณส่งเข้ามาจะถูกใช้ตรวจสอบโดยทีมงานเท่านั้น และไฟล์หลักฐานจะถูกลบออกจากระบบทันทีหลังจากตรวจเสร็จสิ้น โดยระบบจะบันทึกไว้เพียงสถานะ "ผ่าน" หรือ "ไม่ผ่าน"\n• กรณีสิทธิ์ซ้ำซ้อน (ข้อพิพาท): หากมีผู้ใช้งานมากกว่า 1 บัญชีอ้างสิทธิ์ที่นั่งเดียวกัน ระบบจะรักษาความเป็นส่วนตัวสูงสุด โดยทั้งสองฝ่ายจะไม่สามารถมองเห็นตัวตน ข้อมูลส่วนบุคคล หรือหลักฐานของอีกฝ่ายได้ ทีมงานจะเป็นคนกลางในการตรวจสอบหลักฐานเพิ่มเติมและพิจารณาตามดุลยพินิจของทีมงาน' },
        { h: '6. ระยะเวลาการเก็บรักษาและสิทธิ์ของเจ้าของข้อมูล', b: '• การลบข้อมูลตามรอบเวลา: ข้อมูลทั้งหมดที่เกี่ยวข้องกับระบบ (ข้อมูลลงทะเบียน, บันทึกการตรวจสอบ, ข้อพิพาท และ Log ระบบ) จะถูกลบทิ้งอย่างถาวร ภายใน 7 วันหลังสิ้นสุดรอบการแสดงคอนเสิร์ต\n• สิทธิ์ในการจัดการข้อมูลของคุณ: คุณมีสิทธิ์ขอลบหรือเพิกถอนข้อมูลของตัวเองออกจากระบบได้ทุกเมื่อผ่านเมนู "แก้ไขโปรไฟล์" (Edit Profile) ภายในเว็บไซต์' },
        { h: '7. พบปัญหาเพิ่มเติมติดต่อทีมงาน', b: 'x.com account : @susakiiverse' }
      ],

      evidenceModalTitle: en ? 'Submit Evidence' : 'ส่งหลักฐาน',
      evidenceWarning: en
        ? 'Before uploading: redact any personal info (ID number, address, phone, other people\'s names) from the screenshot.'
        : 'ก่อนอัปโหลด: กรุณาปิดบัง/ลบข้อมูลส่วนตัว (ชื่อ ที่อยู่ เบอร์โทรศัพท์ เลขบัตรประชาชน) ในภาพก่อนส่งทุกครั้ง',
      evidenceTypeLabel: en ? 'Evidence type' : 'ประเภทหลักฐาน',
      evidenceTypeVideo: en ? 'Screen recording (recommended)' : 'วิดีโอบันทึกหน้าจอ (แนะนำ)',
      evidenceTypeScreenshot: en ? 'Order confirmation screenshot' : 'ภาพหน้าจอยืนยันคำสั่งซื้อ',
      evidenceFileLabel: en ? 'Choose a file' : 'เลือกไฟล์',
      evidenceFilePickerPlaceholder: en ? 'Tap to choose an image (1 file)' : 'แตะเพื่อเลือกไฟล์รูปภาพ (เลือกได้ 1 ไฟล์)',
      evidenceFileRemoveBtn: en ? 'Remove' : 'นำออก',
      evidenceFileSizeHint: en ? 'Image only, up to 2MB' : 'แนบได้เฉพาะรูปภาพ ขนาดไม่เกิน 2MB',
      evidenceFileTooLarge: en ? 'File too large — please choose an image under 2MB.' : 'ไฟล์ใหญ่เกินไป กรุณาเลือกรูปภาพขนาดไม่เกิน 2MB',
      evidenceUnsupportedType: en
        ? 'This file type is not supported — please choose a JPG, PNG, WEBP, or HEIC image.'
        : 'ไฟล์นี้เป็นประเภทที่ไม่รองรับ กรุณาเลือกรูปภาพชนิด JPG, PNG, WEBP หรือ HEIC เท่านั้น',
      evidenceSessionExpired: en
        ? 'Your session has expired — please log out and log back in, then try submitting evidence again.'
        : 'เซสชันการเข้าสู่ระบบของคุณหมดอายุ กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่ ก่อนลองส่งหลักฐานอีกครั้ง',
      evidenceUploadBtn: en ? 'Upload' : 'อัปโหลด',
      evidenceUploadBtnLoading: en ? 'Uploading…' : 'กำลังอัปโหลด...',
      evidenceReviewTimeNote: en ? 'Review usually takes 24–48 hours. Files are deleted immediately after review.' : 'ปกติใช้เวลาตรวจ 24-48 ชั่วโมง ไฟล์จะถูกลบทันทีหลังตรวจเสร็จ',
      evidenceNoFile: en ? 'Please choose a file first.' : 'กรุณาเลือกไฟล์ก่อน',
      evidenceRateLimited: en
        ? "You've submitted evidence too many times today (max 10/day). Please try again tomorrow, or contact our team if you need to submit more urgently."
        : 'วันนี้คุณส่งหลักฐานไปหลายครั้งเกินไปแล้ว (สูงสุด 10 ครั้ง/วัน) กรุณาลองใหม่พรุ่งนี้ หรือติดต่อทีมงานหากจำเป็นต้องส่งเพิ่มด่วน',
      evidenceSuccess: en ? 'Evidence submitted! We will review it soon.' : 'ส่งหลักฐานสำเร็จ! ทีมงานจะตรวจสอบให้เร็วๆ นี้',
      evidenceHistoryHeading: en ? 'Previously submitted' : 'ที่เคยส่งไปแล้ว',
      evidenceHistoryEmpty: en ? 'No previous submissions' : 'ยังไม่เคยส่งหลักฐานมาก่อน',
      evidenceHistoryLoadingLabel: en ? 'Loading…' : 'กำลังโหลด...',
      evidenceHistoryCurrentTag: en ? 'Will be replaced' : 'จะถูกแทนที่',
      evidenceResultLabel: {
        PENDING: en ? 'Awaiting review' : 'รอตรวจสอบ',
        APPROVED: en ? 'Approved' : 'ผ่าน',
        REJECTED: en ? 'Not approved' : 'ไม่ผ่าน'
      },
      notifHeading: en ? 'Notifications' : 'การแจ้งเตือน',
      notifEmpty: en ? 'No notifications yet' : 'ยังไม่มีการแจ้งเตือน',
      notifMarkAllRead: en ? 'Mark all as read' : 'ทำเครื่องหมายว่าอ่านแล้วทั้งหมด',
      notifViewAll: en ? 'Show all notifications' : 'แสดงการแจ้งเตือนทั้งหมด',
      notifAllHeading: en ? 'All Notifications' : 'การแจ้งเตือนทั้งหมด',
      notifDetailCloseBtn: en ? 'Close' : 'ปิด',
      notifEvent: {
        DUPLICATE_CLAIM: en ? 'Someone else also claimed one of your seats — it is now under review.' : 'มีคนอื่นอ้างสิทธิ์ที่นั่งเดียวกับคุณ ตอนนี้อยู่ระหว่างตรวจสอบ',
        EVIDENCE_RESULT_APPROVED: en ? 'Your evidence was approved — your seat is now verified.' : 'หลักฐานของคุณผ่านการตรวจสอบแล้ว ที่นั่งของคุณยืนยันแล้ว',
        EVIDENCE_RESULT_REJECTED: en ? 'Your evidence was not approved.' : 'หลักฐานของคุณยังไม่ผ่านการตรวจสอบ',
        REVIEW_RESULT_OWNER_CONFIRMED: en ? 'Your dispute case was resolved.' : 'เคสข้อพิพาทของคุณมีผลตัดสินแล้ว',
        REVIEW_RESULT_FALSE_CLAIM_REMOVED: en ? 'Your dispute case was resolved.' : 'เคสข้อพิพาทของคุณมีผลตัดสินแล้ว',
        REVIEW_RESULT: en ? 'Your dispute case was updated.' : 'เคสข้อพิพาทของคุณมีการอัปเดต'
      },

      disclaimer: en
        ? 'This is a fan-made tool, not affiliated with the organizer, artist, agency, or ticket vendor. It cannot verify ticket authenticity and is not a party to any transaction.'
        : 'เครื่องมือนี้ทำโดยแฟนคลับ ไม่ใช่ระบบของผู้จัดงาน ศิลปิน ค่าย หรือผู้ขายบัตร ไม่สามารถยืนยันความแท้ของบัตรได้ และไม่มีส่วนเกี่ยวข้องกับการซื้อขายใดๆ ทั้งสิ้น'
    },

    guide: {
      pageTitle: en ? 'How to Use This Site' : 'วิธีใช้งานเว็บ',
      pageSubtitle: en
        ? 'Every feature explained in detail, with step-by-step instructions and a worked example. Tap a topic to expand it.'
        : 'อธิบายทุกฟีเจอร์แบบละเอียด พร้อมขั้นตอนและตัวอย่างการใช้งานจริง แตะหัวข้อเพื่อเปิดดู',
      accessLabel: en ? 'How to get there' : 'เข้าถึงยังไง',
      stepsLabel: en ? 'How to use it' : 'วิธีใช้งาน',
      exampleLabel: en ? 'Example' : 'ตัวอย่าง',
      goodToKnowLabel: en ? 'Good to know' : 'ควรรู้',
      statusTableLabel: en ? 'Status summary' : 'ตารางสรุปสถานะ',
      searchPlaceholder: en ? 'Search the guide (e.g. "rate limit", "evidence", "dispute")...' : 'ค้นหาในคู่มือ (เช่น "rate limit", "หลักฐาน", "ข้อพิพาท")...',
      searchNoResults: en ? 'No topics match your search.' : 'ไม่พบหัวข้อที่ตรงกับคำค้นหา'
    }
  };
}

function scheduleDataTh() {
  return [
    { dateLabel: 'เสาร์ 22 ส.ค. 2569', time: '09:00', label: 'ระบบคิวออนไลน์เปิดให้เข้าคิวที่ thaiticketmajor.com', dt: '2026-08-22T09:00:00+07:00' },
    { dateLabel: 'เสาร์ 22 ส.ค. 2569', time: '10:00', label: 'เปิดจำหน่ายบัตรออนไลน์ (thaiticketmajor.com)', dt: '2026-08-22T10:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 23 ส.ค. 2569', time: '10:00', label: 'เปิดจำหน่ายทุกช่องทางตามปกติ', dt: '2026-08-23T10:00:00+07:00' },
    { dateLabel: 'เสาร์ 12 ก.ย. 2569', time: '—', label: 'เริ่มเลือกรับบัตรด้วยตนเองได้ที่จุดจำหน่ายบัตร 11 สาขา (เฉพาะกรุงเทพฯ) ได้แก่ เซ็นทรัล ปิ่นเกล้า ชั้น 3, เซ็นทรัลบางนา ชั้น 1, พารากอน ชั้น 5, เอสพลานาด รัชดาภิเษก ชั้น 4, เมเจอร์ รังสิต ชั้น 2, เมเจอร์ รัชโยธิน ชั้น 3, มาลีนนท์ ชั้น 27, สยาม สแควร์วัน ชั้น 7, สามย่าน มิตรทาวน์ ชั้น 3, เซ็นทรัล ชิดลม ชั้น 2, เซ็นทรัล ลาดพร้าว ชั้น 3', dt: '2026-09-12T00:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 18 ต.ค. 2569', time: '—', label: 'ปิดรับบัตรด้วยตนเองที่จุดจำหน่ายบัตรทั้ง 11 สาขา หลังจากนี้รับบัตรได้เฉพาะที่หน้างานในวันแสดงเท่านั้น', dt: '2026-10-18T23:59:00+07:00' },
    { dateLabel: 'จันทร์ 19 ต.ค. 2569', time: '—', label: 'ประกาศผล Random สิทธิ์ Hi-Session (บัตร 5,000 บาท) และ Official Poster เซ็นชื่อ (บัตร 6,900 บาท) ทั้ง 2 รอบ ทางโซเชียลของ GMMTV (จำกัด 1 สิทธิ์ต่อที่นั่ง)', dt: '2026-10-19T23:59:00+07:00' },
    { dateLabel: 'อังคาร 20 ต.ค. 2569', time: '—', label: 'เปิดลงทะเบียนรับสิทธิ์เพิ่มเติม กรณี Random ไม่เต็มจำนวน', dt: '2026-10-20T23:59:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '08:00', label: 'บูธหน้างานเปิด', dt: '2026-10-23T08:00:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '08:00–14:00', label: 'ลงทะเบียนรับสิทธิ์ Fan Benefit หน้างาน (ไม่ลงทะเบียนในเวลา = สละสิทธิ์ แต่ยังเข้าชมโชว์ได้ตามปกติ)', dt: '2026-10-23T14:00:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '13:00', label: 'เปิดฮอลล์สำหรับผู้มีสิทธิ์ Sound Check / Hi-Session / Hi-Touch', dt: '2026-10-23T13:00:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '14:00', label: 'Sound Check (~10 นาที) — ผู้ซื้อบัตะร 6,900/5,900/5,500/5,000 นั่งตามที่ซื้อ', dt: '2026-10-23T14:00:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '—', label: 'Hi-Session ต่อจาก Sound Check — บัตร 5,900/5,500 และ Random บัตร 5,000; หลังขึ้นเวทีต้องออกห้องแล้วกลับเข้าใหม่ก่อนประตูเปิด 17:00 น.', dt: '2026-10-23T15:00:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '—', label: 'Hi-Touch ต่อจาก Hi-Session — เฉพาะบัตร 6,900; หลังขึ้นเวทีต้องออกห้องแล้วกลับเข้าใหม่ก่อนประตูเปิด 17:00 น.', dt: '2026-10-23T15:30:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '17:00', label: 'ประตูเปิด สำหรับผู้ชมทั่วไป', dt: '2026-10-23T17:00:00+07:00' },
    { dateLabel: 'ศุกร์ 23 ต.ค. 2569', time: '18:00', label: 'เริ่มการแสดง', dt: '2026-10-23T18:00:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '08:00', label: 'บูธหน้างานเปิด', dt: '2026-10-24T08:00:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '08:00–14:00', label: 'ลงทะเบียนรับสิทธิ์ Fan Benefit หน้างาน (ไม่ลงทะเบียนในเวลา = สละสิทธิ์ แต่ยังเข้าชมโชว์ได้ตามปกติ)', dt: '2026-10-24T14:00:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '13:00', label: 'เปิดฮอลล์สำหรับผู้มีสิทธิ์ Sound Check / Hi-Session / Hi-Touch', dt: '2026-10-24T13:00:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '14:00', label: 'Sound Check (~10 นาที) — ผู้ซื้อบัตะร 6,900/5,900/5,500/5,000 นั่งตามที่ซื้อ', dt: '2026-10-24T14:00:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '—', label: 'Hi-Session ต่อจาก Sound Check — บัตร 5,900/5,500 และ Random บัตร 5,000; หลังขึ้นเวทีต้องออกห้องแล้วกลับเข้าใหม่ก่อนประตูเปิด 17:00 น.', dt: '2026-10-24T15:00:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '—', label: 'Hi-Touch ต่อจาก Hi-Session — เฉพาะบัตร 6,900; หลังขึ้นเวทีต้องออกห้องแล้วกลับเข้าใหม่ก่อนประตูเปิด 17:00 น.', dt: '2026-10-24T15:30:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '17:00', label: 'ประตูเปิด สำหรับผู้ชมทั่วไป', dt: '2026-10-24T17:00:00+07:00' },
    { dateLabel: 'เสาร์ 24 ต.ค. 2569', time: '18:00', label: 'เริ่มการแสดง', dt: '2026-10-24T18:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '08:00', label: 'บูธหน้างานเปิด', dt: '2026-10-25T08:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '08:00–14:00', label: 'ลงทะเบียนรับสิทธิ์ Fan Benefit หน้างาน (ไม่ลงทะเบียนในเวลา = สละสิทธิ์ แต่ยังเข้าชมโชว์ได้ตามปกติ)', dt: '2026-10-25T14:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '13:00', label: 'เปิดฮอลล์สำหรับผู้มีสิทธิ์ Sound Check / Hi-Session / Hi-Touch', dt: '2026-10-25T13:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '14:00', label: 'Sound Check (~10 นาที) — ผู้ซื้อบัตะร 6,900/5,900/5,500/5,000 นั่งตามที่ซื้อ', dt: '2026-10-25T14:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '—', label: 'Hi-Session ต่อจาก Sound Check — บัตร 5,900/5,500 และ Random บัตร 5,000; หลังขึ้นเวทีต้องออกห้องแล้วกลับเข้าใหม่ก่อนประตูเปิด 17:00 น.', dt: '2026-10-25T15:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '—', label: 'Hi-Touch ต่อจาก Hi-Session — เฉพาะบัตร 6,900; หลังขึ้นเวทีต้องออกห้องแล้วกลับเข้าใหม่ก่อนประตูเปิด 17:00 น.', dt: '2026-10-25T15:30:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '17:00', label: 'ประตูเปิด สำหรับผู้ชมทั่วไป', dt: '2026-10-25T17:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 25 ต.ค. 2569', time: '18:00', label: 'เริ่มการแสดง', dt: '2026-10-25T18:00:00+07:00' },
  ];
}

function scheduleDataEn() {
  return [
    { dateLabel: 'Sat, Aug 22, 2026', time: '09:00', label: 'Online queue system opens at thaiticketmajor.com', dt: '2026-08-22T09:00:00+07:00' },
    { dateLabel: 'Sat, Aug 22, 2026', time: '10:00', label: 'Online ticket sales open (thaiticketmajor.com)', dt: '2026-08-22T10:00:00+07:00' },
    { dateLabel: 'Sun, Aug 23, 2026', time: '10:00', label: 'Regular sales open on all channels', dt: '2026-08-23T10:00:00+07:00' },
    { dateLabel: 'Sat, Sep 12, 2026', time: '—', label: 'Self pick-up opens at 11 official ticket outlets (Bangkok only): Central Pinklao (3F), CentralBangna (1F), Paragon (5F), Esplanade Ratchada (4F), Major Rangsit (2F), Major Ratchayothin (3F), Maleenont Tower (27F), Siam Square One (7F), Samyan Mitrtown (3F), Central Chidlom (2F), Central Ladprao (3F)', dt: '2026-09-12T00:00:00+07:00' },
    { dateLabel: 'Sun, Oct 18, 2026', time: '—', label: 'Self pick-up at ticket outlets closes. After this date, tickets can only be collected onsite on the show day.', dt: '2026-10-18T23:59:00+07:00' },
    { dateLabel: 'Mon, Oct 19, 2026', time: '—', label: "Random-draw results for Hi-Session (5,000 THB ticket) and signed Official Poster (6,900 THB ticket), both shows, announced on GMMTV's social media (limited to 1 entry per seat)", dt: '2026-10-19T23:59:00+07:00' },
    { dateLabel: 'Tue, Oct 20, 2026', time: '—', label: "Extra registration opens if the random draw doesn't fill all slots", dt: '2026-10-20T23:59:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '08:00', label: 'Onsite booth opens', dt: '2026-10-23T08:00:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '08:00–14:00', label: 'Onsite Fan Benefit registration (missing this window forfeits the benefit, but you can still watch the show as normal)', dt: '2026-10-23T14:00:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '13:00', label: 'Hall opens for Sound Check / Hi-Session / Hi-Touch ticket holders', dt: '2026-10-23T13:00:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '14:00', label: 'Sound Check (~10 min) — 6,900/5,900/5,500/5,000 THB ticket holders, seated by ticket', dt: '2026-10-23T14:00:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '—', label: 'Hi-Session, right after Sound Check — 5,900/5,500 THB tickets and Random-selected 5,000 THB tickets; after going onstage you must leave and re-enter the hall before doors open at 5:00 PM', dt: '2026-10-23T15:00:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '—', label: 'Hi-Touch, right after Hi-Session — 6,900 THB tickets only; after going onstage you must leave and re-enter the hall before doors open at 5:00 PM', dt: '2026-10-23T15:30:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '17:00', label: 'Doors open for general attendees', dt: '2026-10-23T17:00:00+07:00' },
    { dateLabel: 'Fri, Oct 23, 2026', time: '18:00', label: 'Show starts', dt: '2026-10-23T18:00:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '08:00', label: 'Onsite booth opens', dt: '2026-10-24T08:00:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '08:00–14:00', label: 'Onsite Fan Benefit registration (missing this window forfeits the benefit, but you can still watch the show as normal)', dt: '2026-10-24T14:00:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '13:00', label: 'Hall opens for Sound Check / Hi-Session / Hi-Touch ticket holders', dt: '2026-10-24T13:00:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '14:00', label: 'Sound Check (~10 min) — 6,900/5,900/5,500/5,000 THB ticket holders, seated by ticket', dt: '2026-10-24T14:00:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '—', label: 'Hi-Session, right after Sound Check — 5,900/5,500 THB tickets and Random-selected 5,000 THB tickets; after going onstage you must leave and re-enter the hall before doors open at 5:00 PM', dt: '2026-10-24T15:00:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '—', label: 'Hi-Touch, right after Hi-Session — 6,900 THB tickets only; after going onstage you must leave and re-enter the hall before doors open at 5:00 PM', dt: '2026-10-24T15:30:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '17:00', label: 'Doors open for general attendees', dt: '2026-10-24T17:00:00+07:00' },
    { dateLabel: 'Sat, Oct 24, 2026', time: '18:00', label: 'Show starts', dt: '2026-10-24T18:00:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '08:00', label: 'Onsite booth opens', dt: '2026-10-25T08:00:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '08:00–14:00', label: 'Onsite Fan Benefit registration (missing this window forfeits the benefit, but you can still watch the show as normal)', dt: '2026-10-25T14:00:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '13:00', label: 'Hall opens for Sound Check / Hi-Session / Hi-Touch ticket holders', dt: '2026-10-25T13:00:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '14:00', label: 'Sound Check (~10 min) — 6,900/5,900/5,500/5,000 THB ticket holders, seated by ticket', dt: '2026-10-25T14:00:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '—', label: 'Hi-Session, right after Sound Check — 5,900/5,500 THB tickets and Random-selected 5,000 THB tickets; after going onstage you must leave and re-enter the hall before doors open at 5:00 PM', dt: '2026-10-25T15:00:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '—', label: 'Hi-Touch, right after Hi-Session — 6,900 THB tickets only; after going onstage you must leave and re-enter the hall before doors open at 5:00 PM', dt: '2026-10-25T15:30:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '17:00', label: 'Doors open for general attendees', dt: '2026-10-25T17:00:00+07:00' },
    { dateLabel: 'Sun, Oct 25, 2026', time: '18:00', label: 'Show starts', dt: '2026-10-25T18:00:00+07:00' },
  ];
}

function scheduleData(en) { return en ? scheduleDataEn() : scheduleDataTh(); }

function seatSummaryData() {
  return [
    { price: 6900, hex: '#2B2156', fg: '#fff', confirmed: true,
      zones: [['A2', 266], ['A3', 266], ['B2', 264]] },
    { price: 5900, hex: '#5169A9', fg: '#fff', confirmed: true,
      zones: [['A1', 147], ['A4', 147], ['B1', 147], ['B3', 147], ['C2', 228]] },
    { price: 5500, hex: '#8AC1E7', fg: '#0d1117', confirmed: true,
      zones: [['C1', 80], ['C3', 80], ['FF', 60], ['HH', 60]] },
    { price: 5000, hex: '#683496', fg: '#fff', confirmed: false,
      zones: [['SG', 136], ['SH', 152], ['SI', 136]] },
    { price: 4500, hex: '#E7698F', fg: '#fff', confirmed: false,
      zones: [['SB', 80], ['SC', 160], ['SD', 160], ['SE', 191], ['SF', 160], ['SJ', 160], ['SK', 191], ['SL', 160], ['SM', 160], ['SN', 80]] },
    { price: 3000, hex: '#787E7A', fg: '#fff', confirmed: true,
      zones: [['C', 197], ['D', 197], ['E', 198], ['F', 143], ['G', 143], ['H', 143], ['I', 143], ['J', 165], ['K', 163], ['L', 165], ['M', 143], ['N', 143], ['O', 143], ['P', 143], ['Q', 198], ['R', 197], ['S', 197]] },
    { price: 2000, hex: '#B1B590', fg: '#0d1117', confirmed: true,
      zones: [['C', 100], ['D', 100], ['E', 108], ['F', 92], ['G', 93], ['H', 93], ['I', 93], ['J', 72], ['K', 35], ['L', 72], ['M', 93], ['N', 93], ['O', 93], ['P', 92], ['Q', 108], ['R', 100], ['S', 100]] },
    { price: 1500, hex: '#D9E1D2', fg: '#0d1117', confirmed: true,
      zones: [['F', 23], ['G', 20], ['H', 40], ['I', 40], ['J', 27], ['L', 27], ['M', 40], ['N', 40], ['O', 20], ['P', 23]] }
  ];
}

function faqData(en) {
  if (en) {
    return [
      { q: "What info do I need to buy tickets, and why can't I get it wrong?", a: 'You must enter your ID card or passport number correctly before choosing a seat, because when you pick up the physical ticket, that number has to match your actual ID exactly.' },
      { q: 'How many tickets can one person (one ID number) buy, and how many times?', a: 'Each ID number can buy once per show, up to 4 tickets per show (if there are 2 shows, you can buy up to 8 total). For example: using your own ID, buy 4 tickets for Saturday’s show, then buy another 4 for Sunday’s show — that’s 8 tickets total, the maximum across both shows.' },
      { q: 'Where do I pick up physical tickets, what do I need, and can they be mailed?', a: 'You must bring the original ID card or passport matching the number used at purchase. Pick up at any of the 11 main Thai Ticket Major branches during the scheduled window, or at the onsite booth on show day (only for that day’s show). Mail delivery is not offered for this event.' },
      { q: 'Once I reach the seat selection page, how much time do I have?', a: "The system gives you a countdown of roughly 10–15 minutes (varies by event) to complete your purchase. If you don't finish in time, the seat is released back into the system immediately." },
      { q: 'When and how will I receive my ticket?', a: 'Pick up at any of the 11 main Thai Ticket Major branches during the scheduled window, or at the onsite booth on show day (only for the show you purchased). Mail delivery isn’t available — you must present the original ID card/passport matching your registration.' },
      { q: 'What payment methods are accepted?', a: 'Credit card, debit card, True Money Wallet, ShopeePay, Alipay, WeChat Pay, and QR PromptPay — all with a 3% payment fee.' },
      { q: 'How do I watch the Live Streaming and RERUN?', a: "You'll receive a viewing link and code by email within 24 hours of purchase. Each code works on one device at a time, at up to 1080p resolution." },
      { q: 'Can I get a refund or switch shows?', a: 'Tickets are non-refundable and non-cancellable under any circumstances.' },
      { q: 'Do children need a ticket?', a: 'Children taller than 90 cm require a ticket to enter.' }
    ];
  }
  return [
    { q: 'ตอนกดซื้อบัตรต้องใช้ข้อมูลอะไรบ้าง และทำไมถึงห้ามกรอกผิด?', a: 'ต้องกรอกเลขบัตรประชาชน หรือเลขพาสปอร์ตให้ถูกต้องก่อนเลือกที่นั่ง เพราะตอนไปรับบัตรจริง เลขที่กรอกไว้จะต้องตรงกับบัตรตัวจริงเท่านั้นถึงจะรับบัตรได้' },
    { q: '1 คน (1 เลขบัตร) สามารถกดซื้อบัตรได้กี่ใบ และกดได้กี่ครั้ง?', a: '1 เลขบัตรกดได้รอบละ 1 ครั้ง และซื้อได้สูงสุดรอบละไม่เกิน 4 ใบ (ถ้ามี 2 รอบการแสดง จะซื้อได้รวมสูงสุด 8 ใบ) เช่น ใช้เลขบัตรประชาชนของตัวเอง กดบัตรรอบวันเสาร์ 1 ครั้ง จำนวน 4 ใบ และกดบัตรรอบวันอาทิตย์อีก 1 ครั้ง จำนวน 4 ใบ — ทำรายการสำเร็จ ได้บัตรทั้งหมด 8 ใบ (ครบโควตาสูงสุดของทั้ง 2 รอบ)' },
    { q: 'รับบัตรจริงได้ที่ไหน ต้องใช้อะไรไปรับบ้าง และส่งไปรษณีย์ได้ไหม?', a: 'ต้องพกบัตรประชาชนหรือพาสปอร์ตตัวจริงที่มีเลขตรงกับตอนซื้อไปรับเท่านั้น โดยไปรับได้ที่ไทยทิคเก็ตเมเจอร์ 11 สาขาหลักตามเวลาที่กำหนด หรือไปรับที่หน้างานในวันแสดง (รับได้เฉพาะรอบของวันนั้น) และงานนี้ไม่มีบริการส่งบัตรทางไปรษณีย์' },
    { q: 'พอเข้าถึงหน้าเลือกที่นั่งได้แล้ว มีเวลาให้ทำรายการกี่นาที?', a: 'ระบบจะมีเวลานับถอยหลังจำกัดให้ทำรายการประมาณ 10–15 นาที (ขึ้นอยู่กับแต่ละงาน) หากทำรายการไม่ทันในเวลา บัตรจะหลุดกลับเข้าระบบทันที' },
    { q: 'จะได้รับบัตรเมื่อไหร่และอย่างไร?', a: 'รับบัตรได้ที่ไทยทิคเก็ตเมเจอร์ 11 สาขาหลักตามช่วงเวลาที่กำหนด หรือรับที่บูธหน้างานในวันแสดง (เฉพาะรอบที่ซื้อ) ไม่สามารถรับทางไปรษณีย์ได้ ต้องแสดงบัตรประชาชน/พาสปอร์ตตัวจริงที่ตรงกับข้อมูลลงทะเบียน' },
    { q: 'ชำระเงินช่องทางไหนได้บ้าง?', a: 'บัตรเครดิต, บัตรเดบิต, True Money Wallet, ShopeePay, Alipay, WeChat Pay, QR PromptPay มีค่าธรรมเนียมการชำระเงิน 3%' },
    { q: 'ดู Live Streaming และ RERUN ได้อย่างไร?', a: 'ระบบจะส่งลิงก์และโค้ดรับชมไปยังอีเมลที่ลงทะเบียนไว้ภายใน 24 ชั่วโมงหลังซื้อ 1 โค้ดเข้าระบบได้ 1 อุปกรณ์ในเวลาเดียวกัน ความละเอียดสูงสุด 1080p' },
    { q: 'ขอคืนเงินหรือเปลี่ยนรอบได้ไหม?', a: 'บัตรที่ซื้อแล้วไม่สามารถคืนเงินหรือยกเลิกได้ในทุกกรณี' },
    { q: 'เด็กต้องซื้อบัตรเข้าชมไหม?', a: 'เด็กที่มีส่วนสูงเกิน 90 ซม. ต้องใช้บัตรเข้าชมการแสดง' }
  ];
}

function tipSections(en) {
  return en ? [
    { title: '⚙️ 1. Setup & Preparation', items: [
      { icon: '🚫', label: 'Disable pop-up blocking', text: "Go to your browser's Settings > Pop-ups and redirects, then allow/disable blocking so you don't get stuck when it opens the payment page." },
      { icon: '⏰', label: 'Log in 30 minutes early', text: 'Log into ThaiTicketMajor at least 30 minutes before the queue opens, to avoid site lag making you miss the login.' },
      { icon: '🌐', label: 'Recommended browsers', text: 'Many people recommend Brave or Opera.', badges: [{ src: 'https://cdn.jsdelivr.net/gh/sutfahwa/LYKN_REFLEXION@main/assets/brave-logo.png' }, { src: 'https://cdn.jsdelivr.net/gh/sutfahwa/LYKN_REFLEXION@main/assets/opera-logo.png' }] }
    ] },
    { title: '🎯 2. Hedging Your Bets in the Queue (Random Queue System)', items: [
      { icon: '🧑‍💻', label: '1 Browser = 1 Account', text: 'Open several different browsers, each with a different account.' },
      { icon: '🕐', label: 'Stagger your entry times', text: 'Enter the site at different times on each browser to spread your chances, e.g. at minute 20, 30, 35, 40, and 45.' },
      { icon: '⚠️', label: 'Fixing the error screen', text: 'If you see "We are sorry, your access has been restricted," switch to a different browser right away, or clear your browsing history/cache and try again.' }
    ] },
    { title: "🎫 3. After You're Through the Queue", items: [
      { icon: '🔢', label: 'Enter your ID and solve the captcha', text: "Enter your ID card/passport number correctly, and stay calm while arranging the captcha images — don't rush and make a mistake." },
      { icon: '⌨️', label: 'If someone beats you to a seat', text: "If tapping a seat shows no checkmark (someone else got it first), press ESC on your keyboard to instantly close the pop-up — it's faster than moving your mouse to close it." },
      { icon: '🔁', label: 'If you need to try again', text: "If your first attempt succeeded and you want to try again, you'll need to rejoin the queue from scratch — and avoid using the same ID number right away, since the system may lock it as already used. Wait about 10–15 minutes for it to unlock." }
    ] }
  ] : [
    { title: '⚙️ 1. การตั้งค่าและเตรียมตัวล่วงหน้า', items: [
      { icon: '🚫', label: 'ปิดบล็อก Pop-up', text: 'เข้า Settings ของเบราว์เซอร์ > ไปที่ ป๊อปอัปและการเปลี่ยนเส้นทาง (Pop-ups and redirects) แล้วเลือก อนุญาต/ปิดการบล็อก เพื่อไม่ให้ติดปัญหาตอนเด้งไปหน้าชำระเงิน' },
      { icon: '⏰', label: 'ล็อกอินล่วงหน้า 30 นาที', text: 'เข้าสู่ระบบ ThaiTicketMajor ไว้ก่อนเริ่มเข้าคิวอย่างน้อยครึ่งชั่วโมง เพื่อเลี่ยงปัญหาเว็บหน่วงจนล็อกอินไม่ทัน' },
      { icon: '🌐', label: 'เบราว์เซอร์แนะนำ', text: 'หลาย ๆ คนแนะนำ Brave หรือ Opera', badges: [{ src: 'https://cdn.jsdelivr.net/gh/sutfahwa/LYKN_REFLEXION@main/assets/brave-logo.png' }, { src: 'https://cdn.jsdelivr.net/gh/sutfahwa/LYKN_REFLEXION@main/assets/opera-logo.png' }] }
    ] },
    { title: '🎯 2. เทคนิคการกระจายความเสี่ยงตอนรันคิว (ระบบสุ่มคิว)', items: [
      { icon: '🧑‍💻', label: '1 เบราว์เซอร์ = 1 บัญชี', text: 'แยกเปิดหลายๆ เบราว์เซอร์และใช้บัญชีไม่ซ้ำกัน' },
      { icon: '🕐', label: 'กระจายเวลาเข้าหน้าเว็บ', text: 'เข้าแต่ละเบราว์เซอร์ในเวลาต่างกันเพื่อกระจายโอกาส เช่น นาทีที่ 20, 30, 35, 40 และ 45' },
      { icon: '⚠️', label: 'วิธีแก้หน้าจอ Error', text: 'หากขึ้นเตือน "We are sorry, your access has been restricted" ให้สลับไปใช้เบราว์เซอร์อื่นทันที หรือกดล้างประวัติ/แคชข้อมูลการท่องเว็บใหม่' }
    ] },
    { title: '🎫 3. ขั้นตอนหลังหลุดคิวเข้าหน้าซื้อบัตร', items: [
      { icon: '🔢', label: 'กรอกเลขบัตรและต่อรูปภาพ (Captcha)', text: 'กรอกเลขบัตรประชาชน/พาสปอร์ตให้ถูกต้อง Update ล่าสุด 📍 หลีกเลี่ยงการใช้ shortcut เนื่องจากอาจจะเกิดปัญหาข้อความที่บันทึกไว้ไม่ถูกนำมาแสดงในช่องพิมพ์ข้อความ และตั้งสติค่อยๆ ลากเรียงรูปภาพ ไม่ต้องรีบจนผิด' },
      { icon: '⌨️', label: 'ทริคแก้ปัญหากดชนที่นั่ง', text: 'หากจิ้มแล้วไม่มีเครื่องหมายติ๊กถูก (มีคนกดไปก่อน) ให้กด ESC บนคีย์บอร์ดเพื่อปิดกล่องแจ้งเตือน Pop-up ทันที จะไวกว่าการใช้เมาส์เลื่อนไปกดปิด' },
      { icon: '🔁', label: 'ข้อควรระวังการกดซ้ำ', text: 'หากกดรอบแรกสำเร็จแล้วต้องการกดใหม่อีกรอบ ต้องไปเริ่มต่อคิวใหม่ และหลีกเลี่ยงการใช้เลขบัตรประชาชนเดิมทันที เพราะระบบอาจล็อกไว้ว่าใช้สิทธิ์ไปแล้ว ต้องรอเวลาบัตรเดิมปลดล็อกประมาณ 10–15 นาที' }
    ] }
  ];
}

function watchlistData(en) {
  const cdn = 'https://cdn.jsdelivr.net/gh/sutfahwa/LYKN_REFLEXION@main/assets/';
  return {
    seriesList: [
      { title: 'ThamePo', poster: cdn + 'thamepo-poster.jpeg', debutDate: en ? 'Dec 13, 2024' : '13 ธ.ค. 2567', members: ['William', 'Nut', 'Hong', 'Tui', 'Lego'], membersLabel: 'William, Nut, Hong, Tui, Lego', channels: [
        { label: 'YouTube', iconSrc: cdn + 'logo-youtube.png', link: 'https://youtube.com/playlist?list=PLX1LJSvFnWLxPedZK366uhdVJdw84eF3p&si=QK-SPjaIfHLxtYuT' },
        { label: 'Netflix', iconSrc: cdn + 'logo-netflix.png', noLink: true }
      ] },
      { title: en ? 'Me and Thee & Peach and Me' : 'มีสติหน่อยคุณธีร์ (Me and Thee) และมีสติแล้วลูกพีช (Peach and Me)', poster: cdn + 'peach-and-me-poster.jpg', members: ['William'], membersLabel: 'William', channels: [
        { label: 'YouTube', iconSrc: cdn + 'logo-youtube.png', link: 'https://youtube.com/playlist?list=PLpBg_eZuaq_06c1zAXzSLtcDCEDKKI5DG&si=lpGXpCpkBj4UEWc0' },
        { label: 'iQIYI', iconSrc: cdn + 'logo-iqiyi.png', link: 'https://www.iq.com/album/peach-and-me-2026-zwu6228dxx?lang=en_us&sh_pltf=4' }
      ] },
      { title: 'หมาเห่าเครื่องบิน', poster: cdn + 'mha-hao-poster.jpeg', members: ['Tui'], membersLabel: 'Tui', channels: [
        { label: 'TrueVisions NOW', noLink: true }
      ] },
      { title: 'You Maniac เดี๋ยวจะรักซะให้บ้า', poster: cdn + 'you-maniac-poster.jpg', debutDate: en ? 'Aug 29, 2026' : '29 ส.ค. 2569', members: ['William'], membersLabel: 'William', channels: [
        { label: en ? 'GMM25 (Live)' : 'GMM25 (ถ่ายทอดสด)', noLink: true },
        { label: en ? 'OneD App (Rerun)' : 'แอป OneD (ดูย้อนหลัง)', noLink: true }
      ] },
      { title: 'Twenty One เราลองมารักกันสัก 21 วันดูไหม', poster: cdn + '21วัน.png', members: ['Nut', 'Hong'], membersLabel: 'Nut, Hong', channels: [
        { label: 'เร็วๆนี้', noLink: true }
      ] }
    ],
    soloSongs: [
      { title: en ? 'Tasty' : 'Tasty (เทสดี)', artist: 'NUTDAN', releaseDate: en ? 'Jun 22, 2026' : '22 มิ.ย. 2569', members: ['Nut'], cover: cdn + 'song-tasty-nutdan.jpeg', link: 'https://www.youtube.com/watch?v=fg5DGDB-frw&list=RDfg5DGDB-frw&start_radio=1' },
      { title: 'ถูกสเปค', artist: 'Hongshi', members: ['Hong'], cover: cdn + 'song-tukspec-hong.jpeg', link: 'https://youtu.be/CvTuWXb-8hk?si=lc38h4YSZl41zN34' },
      { title: 'จำได้ว่าลืม', artist: 'William Jakrapatr', members: ['William'], cover: cdn + 'song-jamdailuem-william.jpg', link: 'https://youtu.be/Kq5ZmWrtnW8?si=mIM-lOA9ZFOl3ah4' },
      { title: 'ปล่อยใจ', artist: 'TuiChayatorn', members: ['Tui'], cover: cdn + 'song-ploijai-tui.jpg', link: 'https://youtu.be/cqW6CfRZOlc?si=sJge6TstJ5qFy5OY' }
    ],
    groupSongs: [
      { title: 'ถ้าเกิด (If Only)', cover: cdn + 'song-thakoed.jpg', members: ['William', 'Nut', 'Hong', 'Tui', 'Lego'], link: 'https://youtu.be/hBJDV9A9_8A?si=9q8xndt_UloEB7hk' },
      { title: 'ล็อกมง (You Shine I Choose)', cover: cdn + 'song-lokmong.jpg', members: ['William', 'Nut', 'Hong', 'Tui', 'Lego'], link: 'https://youtu.be/rOnHI01ZP7k?si=S8FLSmW0DU6oqvtQ' },
      { title: 'โลเล โยเย โมเม (No Way)', cover: cdn + 'song-noway.jpg', members: ['William', 'Nut', 'Hong', 'Tui', 'Lego'], link: 'https://youtu.be/FhEc_UZ-I6I?si=ky0oPF2ZzAbRI2lp' }
    ]
  };
}

function pickupCasesData(en) {
  return [
    { owner: 'ตัวเอง', bookedId: 'ตัวเอง', picker: 'ตัวเอง', docs: en ? ['Your original ID card/passport', 'Proof of payment'] : ['บัตรประชาชน/พาสปอร์ตตัวจริงของตัวเอง', 'หลักฐานการชำระเงิน'] },
    { owner: 'ตัวเอง', bookedId: 'ตัวเอง', picker: 'เพื่อน', docs: en ? ['Copy of your ID card/passport', "Friend's original ID card/passport", 'Proof of payment'] : ['สำเนาบัตรประชาชน/พาสปอร์ตของตัวเอง', 'บัตรประชาชน/พาสปอร์ตตัวจริงของเพื่อน', 'หลักฐานการชำระเงิน'] },
    { owner: 'ตัวเอง', bookedId: 'เพื่อน', picker: 'ตัวเอง', docs: en ? ["Friend's original ID card/passport", 'Your original ID card/passport', 'Proof of payment'] : ['บัตรประชาชน/พาสปอร์ตตัวจริงของเพื่อน', 'บัตรประชาชน/พาสปอร์ตตัวจริงของตัวเอง', 'หลักฐานการชำระเงิน'] },
    { owner: 'ตัวเอง', bookedId: 'เพื่อน', picker: 'เพื่อน', docs: en ? ['Copy of your ID card/passport', "Friend's original ID card/passport", 'Proof of payment'] : ['สำเนาบัตรประชาชน/พาสปอร์ตของตัวเอง', 'บัตรประชาชน/พาสปอร์ตตัวจริงของเพื่อน', 'หลักฐานการชำระเงิน'] },
    { owner: 'เพื่อน', bookedId: 'เพื่อน', picker: 'ตัวเอง', docs: en ? ["Copy of friend's ID card/passport", 'Your original ID card/passport', "Friend's original ID card/passport", 'Proof of payment'] : ['สำเนาบัตรประชาชน/พาสปอร์ตของเพื่อน', 'บัตรประชาชน/พาสปอร์ตตัวจริงของตัวเอง', 'บัตรประชาชน/พาสปอร์ตตัวจริงของเพื่อน', 'หลักฐานการชำระเงิน'] },
    { owner: 'เพื่อน', bookedId: 'ตัวเอง', picker: 'เพื่อน', docs: en ? ["Friend's original ID card/passport", 'Your original ID card/passport', 'Proof of payment'] : ['บัตรประชาชน/พาสปอร์ตตัวจริงของเพื่อน', 'บัตรประชาชน/พาสปอร์ตตัวจริงของตัวเอง', 'หลักฐานการชำระเงิน'] },
    { owner: 'เพื่อน', bookedId: 'ตัวเอง', picker: 'ตัวเอง', docs: en ? ["Copy of friend's ID card/passport", 'Your original ID card/passport', 'Proof of payment'] : ['สำเนาบัตรประชาชน/พาสปอร์ตของเพื่อน', 'บัตรประชาชน/พาสปอร์ตตัวจริงของตัวเอง', 'หลักฐานการชำระเงิน'] },
    { owner: 'ตัวเอง', bookedId: 'เพื่อน', picker: 'บุคคลที่ 3', docs: en ? ['Copy of your ID card/passport (signed authorization for the third party)', "Friend's original ID card/passport (owner of the ID used at booking)", "Third party's original ID card/passport (the person picking up)"] : ['สำเนาบัตรประชาชน/พาสปอร์ตของตัวเอง (เซ็นมอบอำนาจให้บุคคลที่ 3)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของเพื่อน (เจ้าของเลขบัตรตอนจอง)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของบุคคลที่ 3 (คนรับบัตร)'] },
    { owner: 'เพื่อน', bookedId: 'ตัวเอง', picker: 'บุคคลที่ 3', docs: en ? ["Copy of friend's ID card/passport (signed authorization for the third party)", 'Your original ID card/passport (owner of the ID used at booking)', "Third party's original ID card/passport (the person picking up)"] : ['สำเนาบัตรประชาชน/พาสปอร์ตของเพื่อน (เซ็นมอบอำนาจให้บุคคลที่ 3)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของตัวเอง (เจ้าของเลขบัตรตอนจอง)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของบุคคลที่ 3 (คนรับบัตร)'] },
    { owner: 'ตัวเอง', bookedId: 'ตัวเอง', picker: 'บุคคลที่ 3', docs: en ? ['Copy of your ID card/passport (signed authorization for the third party)', 'Your original ID card/passport (owner of the ID used at booking)', "Third party's original ID card/passport (the person picking up)"] : ['สำเนาบัตรประชาชน/พาสปอร์ตของตัวเอง (เซ็นมอบอำนาจให้บุคคลที่ 3)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของตัวเอง (เจ้าของเลขบัตรตอนจอง)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของบุคคลที่ 3 (คนรับบัตร)'] },
    { owner: 'เพื่อน', bookedId: 'เพื่อน', picker: 'บุคคลที่ 3', docs: en ? ["Copy of friend's ID card/passport (signed authorization for the third party)", "Friend's original ID card/passport (owner of the ID used at booking)", "Third party's original ID card/passport (the person picking up)"] : ['สำเนาบัตรประชาชน/พาสปอร์ตของเพื่อน (เซ็นมอบอำนาจให้บุคคลที่ 3)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของเพื่อน (เจ้าของเลขบัตรตอนจอง)', 'บัตรประชาชน/พาสปอร์ตตัวจริงของบุคคลที่ 3 (คนรับบัตร)'] }
  ];
}

// เนื้อหาหน้า "วิธีใช้งานเว็บ" — แยกทีละฟีเจอร์แบบละเอียด (เข้าถึงยังไง/วิธีใช้งาน/
// ตัวอย่าง/ควรรู้) แต่ละหัวข้อเป็น accordion แยกกดเปิดทีละอัน อ้างอิงจาก flow จริง
// ของระบบ (สถานะบัตร, ลิมิต, ข้อความ error) ไม่ได้แต่งเนื้อหาที่ไม่มีอยู่จริงในระบบ
function guideSections(en) {
  return en ? [
    { key: 'start', title: 'Getting Started',
      summary: 'First time here? How to open the menu, log in, and switch languages.',
      access: ['Works right away on the home page — no login needed to look around.'],
      steps: [
        'Tap the ☰ button (top right) to open the menu — every page on the site is listed there with a short description underneath.',
        'Tap the profile icon (top right) to log in — the site only supports "Log in with X", one tap and you\'re in.',
        'Switch Thai/English any time from the TH/EN pills at the top of the menu box.'
      ],
      example: 'Example: first visit → tap ☰ → see "Concert Details", "My Profile", etc. → tap "My Profile" → since you\'re not logged in yet, you land on the login screen → tap "Log in with X" → approve the app → you\'re back on My Profile, now logged in.',
      goodToKnow: [
        'Logging in with X auto-fills your @ handle from that X account — once set, it can never be changed.'
      ]
    },
    { key: 'details', title: 'Concert Details',
      summary: 'Date, venue, show times, and the full ticket-sale schedule.',
      access: ['Menu ☰ → "Concert Details".'],
      steps: [
        'This page has 4 sub-tabs: Overview, How to Buy, Where\'s My Seat, and Seat Check.',
        'The "Overview" tab has the detailed sale schedule — sale-open times, which round/zone goes first, and so on.'
      ],
      example: 'Example: want to know what time the Oct 24 show opens for sale? Go to the "Overview" tab and scroll to "Sale Schedule" — it\'s broken down by round.',
      goodToKnow: ['Prices and zone info on this page follow the latest official announcement — if anything changes, the team updates this page as fast as possible.']
    },
    { key: 'seatmap', title: "Where's My Seat",
      summary: 'A simulated 3D seat map so you can see roughly where a seat sits, and its price, before you buy.',
      access: ['Menu ☰ → "Concert Details" → "Where\'s My Seat" tab.'],
      steps: [
        'Rotate/zoom the 3D map with your finger (mobile) or mouse (desktop).',
        'Tap a zone to see its price and seat count.',
        'Tap "View Seat Map" inside a zone to see the exact rows and seat numbers.'
      ],
      example: 'Example: curious how close Zone A1 is to the stage? Tap Zone A1 on the 3D map → see its price + rough distance from stage → tap "View Seat Map" → see rows AA–AZ with every seat number laid out.',
      goodToKnow: [
        'The map is a simulation referenced from other events at the same venue — it is not this show\'s 100% official layout.',
        'The 5,000 / 4,500 THB zones are not yet confirmed pricing data for this specific show — wait for the official announcement.'
      ]
    },
    { key: 'check', title: 'Seat Check',
      summary: 'Checks whether a seller\'s @ handle matches who actually registered that seat, before you pay.',
      access: ['Menu ☰ → "Concert Details" → "Seat Check" tab. No login required.'],
      steps: [
        'Enter the show round, zone, row, and seat number.',
        'Enter the seller\'s x.com @ handle — the person claiming to own that ticket.',
        'Tap "Check" — the system shows one of the results below.'
      ],
      statusTable: [
        { label: 'No data yet', color: '#c7d4d2', bg: 'rgba(255,255,255,0.08)', desc: 'Nobody has registered this seat in the system at all.' },
        { label: 'Matched (not yet reviewed)', color: '#ffd400', bg: 'rgba(255,212,0,0.12)', desc: 'The title reads "Seat info matches what\'s registered under @[handle] — not yet verified" — the team just hasn\'t reviewed the evidence yet.' },
        { label: 'Matched and verified', color: '#6fe0d6', bg: 'rgba(111,224,214,0.12)', desc: 'The title reads "Seat info matches @[handle] and is verified" — the safest result you can get.' },
        { label: 'Under dispute review', color: '#ffb066', bg: 'rgba(255,176,32,0.12)', desc: 'More than one person claims this seat. No details are shown while the team is still reviewing.' },
        { label: 'Does not match', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: 'The handle entered doesn\'t match who registered this seat — be extra careful, ask the seller directly.' },
        { label: 'This is your own seat', color: '#6fe0d6', bg: 'rgba(111,224,214,0.12)', desc: 'Shown only if you\'re logged in and checking a seat you registered yourself — tells you to manage it from "My Tickets" instead of the usual match result.' }
      ],
      example: 'Example: someone tweets a ticket for sale — Zone A1, Row AG, Seat 5, @sellername. Enter round = Fri Oct 23, zone = A1, row = AG, seat = 5, handle = sellername, then tap "Check". If it genuinely matches, the result title itself reads "Seat info matches @sellername and is verified."',
      goodToKnow: [
        'Even a "Matched and verified" result does NOT guarantee the ticket is genuine — it only means the handle matches what was self-reported in this system, not official ticketing data.',
        'The system never reveals the seat owner\'s name or identity to whoever is checking, except echoing back the handle you yourself typed in.'
      ]
    },
    { key: 'register', title: 'Register a Seat',
      summary: 'Register a seat that is really yours, tied to your x.com @ handle, so others can Seat-Check it.',
      access: ['Log in → "My Profile" → "Register" tab.'],
      steps: [
        'Choose the show round, zone, row, and enter your seat number (must match your real ticket).',
        'Optionally enter the name printed on the ticket — your @ handle is pulled from your logged-in account automatically and can\'t be edited here.',
        'Tick both checkboxes (confirming it\'s really your seat, and accepting the terms), then tap "Register Seat".',
        'A missing field shows its error right under that field. Every other problem (see the table below) shows as a popup with an OK button instead.'
      ],
      statusTable: [
        { label: 'Success — seat was free', color: '#6fe0d6', bg: 'rgba(111,224,214,0.12)', desc: 'A popup confirms success with a button straight to "Manage My Tickets". New status: "Awaiting evidence".' },
        { label: 'Success — seat already claimed', color: '#ffb066', bg: 'rgba(255,176,32,0.12)', desc: 'After you tap "Yes" on the confirm popup, it registers anyway and opens a dispute. New status: "Under dispute review".' },
        { label: 'Seat cooldown (15 min)', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: 'This seat was just deleted by someone — a popup tells you to wait 15 minutes before it can be registered again.' },
        { label: 'Already ruled not yours', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: 'A past dispute already decided this seat isn\'t yours — a popup explains you can\'t register it again.' },
        { label: 'Rate limited (20/day)', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: 'You\'ve registered or edited seats 20 times today already — a popup asks you to try again tomorrow, or contact the team.' }
      ],
      example: 'Example: you have a real ticket for Zone A1, Row AG, Seat 2, Oct 23 show. Pick round = Oct 23, zone = A1, row = AG, seat = 2 → tap Register. If nobody else has claimed that seat, a success popup appears and you land on "Awaiting evidence". If someone else already registered that exact seat, a popup asks you to confirm first ("This seat already has a claim — are you sure this is really your seat?") — tap "Yes" to proceed anyway, which opens a dispute for the team to review (see "Manage Disputes" below).',
      goodToKnow: [
        'Limited to 20 registrations (and edits) per day per account, to prevent spam.',
        'If a seat was just deleted, there\'s a 15-minute cooldown before it can be registered again (stops rapid re-grabbing).',
        'Your account x.com handle comes straight from your X login and is set automatically — there is no separate step for it.'
      ]
    },
    { key: 'manageTickets', title: 'Manage My Tickets',
      summary: 'Check status, submit evidence, edit, or delete a seat you\'ve registered — with a full history log.',
      access: ['Log in → "My Profile" → "Manage Tickets" → "Manage My Tickets" sub-tab.'],
      steps: [
        'Each ticket shows one of the statuses in the table below.',
        'Tap "Submit Evidence" to upload a photo proving ownership (image only, max 2MB). Limited to 10 submissions per day.',
        'Tap "Edit" to change zone/row/seat — the system warns you first that this resets the review status.',
        'Tap "Delete" if you registered by mistake or no longer need that entry.',
        'Tap "↻ Refresh" next to the "My Tickets / Disputes" tab pills any time to reload the latest data without a full page reload.'
      ],
      statusTable: [
        { label: 'Awaiting evidence', color: '#ffd400', bg: 'rgba(255,212,0,0.12)', desc: 'Registered, nothing submitted yet. You can still edit, delete, or submit evidence.' },
        { label: 'Awaiting document review', color: '#6fb4ff', bg: 'rgba(111,180,255,0.15)', desc: 'Evidence sent, waiting on the team. Can still edit or delete.' },
        { label: 'Verified', color: '#6fe0d6', bg: 'rgba(111,224,214,0.15)', desc: 'Passed review — the safest state a ticket can be in.' },
        { label: 'Under dispute review', color: '#ffb066', bg: 'rgba(255,176,32,0.15)', desc: 'Someone else also claims this seat. Can\'t edit or delete — only submit more evidence.' },
        { label: 'Registration invalid', color: '#ff6b6b', bg: 'rgba(255,90,90,0.15)', desc: 'The team ruled this seat isn\'t yours, with a reason attached. Only the Delete button remains.' },
        { label: 'Failed document review', color: '#ff9d3f', bg: 'rgba(255,140,0,0.15)', desc: 'Your evidence was rejected, with a reason attached — you can still edit or submit new evidence to try again.' }
      ],
      example: 'Example timeline for one ticket — 10:00 register the seat → status "Awaiting evidence" → 10:05 upload proof photo → status becomes "Under document review" with a 48-hour countdown → 11:00 someone else registers the same seat and confirms it\'s theirs too → your status flips to "Under dispute review" immediately (submit more evidence if you haven\'t yet) → the team decides → if you win the case, status returns to "Verified"; if you lose, it becomes "Registration invalid".',
      goodToKnow: [
        'Editing is capped at 20 per day, same as registrations. Submitting evidence has its own separate cap of 10 per day.',
        'A ticket "Under dispute review" can\'t be edited or deleted — only more evidence can be submitted.',
        'All registration data is permanently deleted within 7 days after the concert.'
      ]
    },
    { key: 'manageDisputes', title: 'Manage Disputes',
      summary: 'Cases where more than one person claims the same seat — check status and submit more evidence here.',
      access: ['Log in → "My Profile" → "Manage Tickets" → "Manage Disputes" sub-tab.'],
      steps: [
        'See every dispute case you\'re involved in, each with a status from the table below and a progress timeline (Filed → Evidence → Team Review → Result).',
        'Tap "Submit Evidence" to attach more proof supporting your claim. As soon as you submit, your own step in the timeline jumps to "Team Review" — you don\'t have to wait for the other side to submit first.',
        'Tap "↻ Refresh" next to the tab pills to reload the latest data, or "Contact the team" if you need to reach us directly — both sit right there next to the "My Tickets / Disputes" tabs.'
      ],
      statusTable: [
        { label: 'Awaiting review', color: '#ffb066', bg: 'rgba(255,176,32,0.12)', desc: 'The case is open, waiting for the team to compare both sides\' evidence.' },
        { label: 'Awaiting more evidence', color: '#6fb4ff', bg: 'rgba(111,180,255,0.15)', desc: 'The team asked for more evidence before ruling — the case stays open.' },
        { label: 'Confirmed as yours', color: '#6fe0d6', bg: 'rgba(111,224,214,0.15)', desc: 'You won the case — no reason is shown, just a note that the ruling is based only on evidence submitted.' },
        { label: 'Confirmed to belong to someone else', color: '#ff6b6b', bg: 'rgba(255,90,90,0.15)', desc: 'You lost the case, with the team\'s written reason attached.' },
        { label: 'Inconclusive', color: '#a9c4c2', bg: 'rgba(255,255,255,0.08)', desc: 'The team couldn\'t reach a conclusion — every claim on this seat reverts to "Awaiting evidence" so anyone can submit more proof or edit their entry.' }
      ],
      example: 'Example: you and another person both registered Zone A1, Row AG, Seat 2 — the team opens one dispute case. Neither side can see who the other is; each submits their own evidence (payment slip, booking screenshot) into this tab independently. Once resolved, the winning side sees a green "Confirmed as yours" tag with no reason attached, and the losing side sees a red "Confirmed to belong to someone else" tag along with the team\'s written reason — both also get a note explaining the ruling is based only on submitted evidence, with a contact link if they still have questions.',
      goodToKnow: [
        'Whoever\'s evidence gets verified first wins the case — it is NOT decided by who registered first, so submit clear evidence quickly.',
        'Submitting evidence is optional, but strongly recommended — it\'s your best chance of winning the case.',
        'We never reveal who the other claimant is, even after the case is resolved — please don\'t speculate publicly.'
      ]
    },
    { key: 'editProfile', title: 'Edit Profile',
      summary: 'Change your display name, avatar, and background color.',
      access: ['Log in → "My Profile" → "Edit Profile" button at the top.'],
      steps: [
        'Change your display name, and pick an avatar and background color you like.',
        'Tap Save.'
      ],
      example: 'Example: want to change your display name from "sakinut" to something else? Tap "Edit Profile" → type the new name into "Display Name" → tap Save → the new name shows up immediately everywhere your old name used to appear.',
      goodToKnow: ['Your display name can be changed as many times as you like — unlike your account x.com handle, which can only be set once.']
    },
    { key: 'other', title: 'Other Menus',
      summary: 'Ticket Tips, LYKN Watchlist, FAQ, and Lucky Draw.',
      access: ['Menu ☰ → any of the items below.'],
      steps: [
        'Ticket Tips: how to prepare before/during/after the ticket queue opens.',
        'LYKN Watchlist: series and songs recommended before the show.',
        'FAQ: answers about buying, picking up tickets, payment, and live streaming.',
        'Lucky Draw: a chance to win exclusive prizes.'
      ]
    },
    { key: 'conditions', title: 'Important Things to Know',
      summary: 'What this site is (and isn\'t), and how your data is handled.',
      steps: [
        'This is a fan-made tool, not affiliated with the organizer, artist, agency, or ticket vendor. It cannot verify ticket authenticity and is not a party to any transaction.',
        'Seat Check and Seat Registration rely entirely on data users enter themselves — not official ticketing-system data.',
        'All registration data is permanently deleted within 7 days after the concert.',
        'Questions or problems? Contact the team at x.com/@susakiiverse (linked in the footer of every page).'
      ]
    }
  ] : [
    { key: 'start', title: 'เริ่มต้นใช้งาน',
      summary: 'เข้าเว็บครั้งแรก เปิดเมนูยังไง เข้าสู่ระบบยังไง และเปลี่ยนภาษายังไง',
      access: ['เข้าใช้ได้ทันทีตั้งแต่หน้าแรก ไม่ต้อง login ก็เดินดูรอบเว็บได้'],
      steps: [
        'กดปุ่ม ☰ มุมขวาบนเพื่อเปิดเมนู จะเห็นทุกหน้าของเว็บพร้อมคำอธิบายสั้นๆ ใต้แต่ละเมนู',
        'กดปุ่มรูปโปรไฟล์ (มุมขวาบน) เพื่อเข้าสู่ระบบ — เว็บนี้รองรับแค่ "เข้าสู่ระบบด้วย X" เท่านั้น กดทีเดียวจบ',
        'เปลี่ยนภาษาไทย/อังกฤษได้ทุกเมื่อจากปุ่ม TH/EN มุมบนของกล่องเมนู'
      ],
      example: 'ตัวอย่าง — เข้าเว็บครั้งแรก กด ☰ → เห็นเมนู "รายละเอียดคอนเสิร์ต", "โปรไฟล์ของฉัน" ฯลฯ → กด "โปรไฟล์ของฉัน" → เพราะยังไม่ได้ login ระบบเลยพาไปหน้า login → กด "เข้าสู่ระบบด้วย X" → กดอนุญาตแอป → กลับมาที่หน้าโปรไฟล์ของฉัน ตอนนี้ login แล้ว',
      goodToKnow: [
        'login ด้วย X ระบบจะดึง @ handle จากบัญชี X มาผูกให้อัตโนมัติ — ผูกแล้วเปลี่ยนไม่ได้อีก'
      ]
    },
    { key: 'details', title: 'รายละเอียดคอนเสิร์ต',
      summary: 'วันที่ สถานที่ เวลาการแสดง และกำหนดการเปิดขายบัตรแบบละเอียด',
      access: ['เมนู ☰ → "รายละเอียดคอนเสิร์ต"'],
      steps: [
        'หน้านี้มีแท็บย่อย 4 แท็บ: ภาพรวม, วิธีการกดบัตร, Where\'s My Seat, ตรวจสอบที่นั่ง',
        'แท็บ "ภาพรวม" มีกำหนดการเปิดขายบัตรแบบละเอียด เช่น เวลาเปิดขาย รอบไหน/โซนไหนก่อน'
      ],
      example: 'ตัวอย่าง — อยากรู้ว่ารอบ 24 ต.ค. เปิดขายกี่โมง ไปที่แท็บ "ภาพรวม" เลื่อนหาหัวข้อ "กำหนดการขายบัตร" จะเห็นตารางแยกตามรอบให้',
      goodToKnow: ['ข้อมูลราคา/โซนในหน้านี้อ้างอิงจากประกาศทางการล่าสุด ถ้ามีการเปลี่ยนแปลงทีมงานจะอัปเดตหน้านี้ให้เร็วที่สุด']
    },
    { key: 'seatmap', title: "Where's My Seat (ผังที่นั่ง)",
      summary: 'ผังที่นั่งจำลอง 3D ดูตำแหน่งคร่าวๆ และราคา ก่อนตัดสินใจซื้อ',
      access: ['เมนู ☰ → "รายละเอียดคอนเสิร์ต" → แท็บ "Where\'s My Seat"'],
      steps: [
        'หมุน/ซูมผังที่นั่ง 3D ได้ด้วยนิ้ว (มือถือ) หรือเมาส์ (คอม)',
        'แตะที่โซนที่สนใจ จะเห็นราคาและจำนวนที่นั่งของโซนนั้น',
        'กด "ดูผังที่นั่ง" ในแต่ละโซนเพื่อดูตำแหน่งแถว/เลขที่นั่งแบบละเอียด'
      ],
      example: 'ตัวอย่าง — อยากรู้ว่าโซน A1 อยู่ใกล้เวทีแค่ไหน แตะโซน A1 บนผัง 3D → เห็นราคา + ระยะห่างจากเวทีโดยประมาณ → กด "ดูผังที่นั่ง" → เห็นแถว AA–AZ พร้อมเลขที่นั่งแต่ละแถว',
      goodToKnow: [
        'ผังเป็นการจำลองมุมมองอ้างอิงจากงานอื่นที่จัดสถานที่เดียวกัน ไม่ใช่มุมมองทางการของงานนี้ 100%',      ]
    },
    { key: 'check', title: 'ตรวจสอบที่นั่ง (Seat Check)',
      summary: 'เช็คว่า @ ของผู้ขายตรงกับคนที่ลงทะเบียนที่นั่งนั้นไว้จริงหรือไม่ ก่อนโอนเงิน',
      access: ['เมนู ☰ → "รายละเอียดคอนเสิร์ต" → แท็บ "ตรวจสอบที่นั่ง" (ไม่ต้อง login ก็ใช้ได้)'],
      steps: [
        'เลือกรอบการแสดง โซน แถว และกรอกเลขที่นั่ง',
        'กรอก account x.com ของคนที่อ้างว่าเป็นเจ้าของบัตร (คนขาย)',
        'กด "ตรวจสอบ" ระบบจะขึ้นผลลัพธ์อย่างใดอย่างหนึ่งตามตารางด้านล่าง'
      ],
      statusTable: [
        { label: 'ยังไม่มีข้อมูล', color: '#c7d4d2', bg: 'rgba(255,255,255,0.08)', desc: 'ยังไม่มีใครลงทะเบียนที่นั่งนี้ไว้ในระบบเลย' },
        { label: 'ตรงกัน (ยังไม่ผ่านการตรวจหลักฐาน)', color: '#ffd400', bg: 'rgba(255,212,0,0.12)', desc: 'หัวข้อจะขึ้นตรงๆ ว่า "ข้อมูลที่นั่งตรงกับที่ลงทะเบียนไว้ใน @[handle] แต่ยังไม่ได้รับการยืนยัน" เพียงแต่ทีมงานยังไม่ได้ตรวจหลักฐานเท่านั้น' },
        { label: 'ตรงกัน และยืนยันแล้ว', color: '#6fe0d6', bg: 'rgba(111,224,214,0.12)', desc: 'หัวข้อจะขึ้นตรงๆ ว่า "ข้อมูลที่นั่งตรงกับ @[handle] และยืนยันแล้ว" — ผลที่ปลอดภัยที่สุด' },
        { label: 'อยู่ระหว่างตรวจสอบโดยทีมงาน', color: '#ffb066', bg: 'rgba(255,176,32,0.12)', desc: 'มีผู้อ้างสิทธิ์ที่นั่งนี้มากกว่าหนึ่งคน ระบบไม่แสดงรายละเอียดขณะที่ทีมงานยังตรวจสอบอยู่' },
        { label: 'ไม่ตรงกัน', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: '@ ที่กรอกไม่ตรงกับที่ลงทะเบียนไว้สำหรับที่นั่งนี้ — ระวังเป็นพิเศษ ลองสอบถามผู้ขายโดยตรงดูก่อน' },
        { label: 'ที่นั่งนี้เป็นของคุณเอง', color: '#6fe0d6', bg: 'rgba(111,224,214,0.12)', desc: 'ขึ้นเฉพาะตอน login อยู่ และกำลังเช็คที่นั่งที่ตัวเองลงทะเบียนไว้ — จะแนะนำให้ไปจัดการที่เมนู "บัตรของฉัน" แทนผลตรงปกติ' }
      ],
      example: 'ตัวอย่าง — มีคนทวีตขายบัตรโซน A1 แถว AG เลข 5 พร้อม @sellername กรอก รอบ = ศุกร์ 23 ต.ค., โซน = A1, แถว = AG, เลขที่นั่ง = 5, @ = sellername แล้วกด "ตรวจสอบ" ถ้าตรงจริง หัวข้อผลลัพธ์จะขึ้นตรงๆ ว่า "ข้อมูลที่นั่งตรงกับ @sellername และยืนยันแล้ว"',
      goodToKnow: [
        'แม้ผลจะขึ้น "ตรงกัน และยืนยันแล้ว" ก็ไม่ได้แปลว่าบัตรเป็นของแท้เสมอไป แค่บอกว่า @ ตรงกับที่ลงทะเบียนไว้ในระบบนี้เท่านั้น (เป็นข้อมูลที่ผู้ใช้กรอกเอง ไม่ใช่ระบบขายบัตรทางการ)',
        'ระบบไม่แสดงชื่อ/ข้อมูลเจ้าของที่นั่งจริงให้ผู้ตรวจสอบเห็นเลย นอกจาก @ ที่คุณพิมพ์เข้าไปเอง'
      ]
    },
    { key: 'register', title: 'ลงทะเบียนบัตร',
      summary: 'ลงทะเบียนที่นั่งที่เป็นของคุณจริง ผูกกับ account x.com ของคุณ เพื่อให้คนอื่นตรวจสอบได้ผ่าน Seat Check',
      access: ['Login แล้วไปที่ "โปรไฟล์ของฉัน" → แท็บ "ลงทะเบียนบัตร"'],
      steps: [
        'เลือกรอบการแสดง โซน แถว และกรอกเลขที่นั่ง (ต้องตรงกับบัตรจริงที่คุณมี)',
        'กรอกชื่อบนบัตรได้ถ้าอยากใส่ (ไม่บังคับ) — ส่วน account x.com จะดึงจากบัญชีที่ login มาให้อัตโนมัติ แก้ตรงนี้ไม่ได้',
        'ติ๊กยืนยัน 2 ข้อ (ยืนยันว่าเป็นบัตรของตัวเองจริง + ยอมรับเงื่อนไข) แล้วกด "ลงทะเบียนที่นั่ง"',
        'กรอกข้อมูลไม่ครบ จะขึ้น error ใต้ช่องนั้นๆ เลย ส่วนปัญหาอื่นๆ (ดูตารางด้านล่าง) จะขึ้นเป็น popup แจ้งเตือนพร้อมปุ่ม OK แทน'
      ],
      statusTable: [
        { label: 'สำเร็จ — ที่นั่งว่าง', color: '#6fe0d6', bg: 'rgba(111,224,214,0.12)', desc: 'ขึ้น popup แจ้งสำเร็จ พร้อมปุ่มไปที่ "จัดการบัตรของฉัน" ทันที สถานะใหม่คือ "รอยืนยันหลักฐาน"' },
        { label: 'สำเร็จ — แต่ที่นั่งมีคนลงไว้แล้ว', color: '#ffb066', bg: 'rgba(255,176,32,0.12)', desc: 'หลังกด "ใช่" ยืนยันใน popup เตือน ระบบลงทะเบียนต่อให้และเปิดข้อพิพาททันที สถานะใหม่คือ "อยู่ระหว่างตรวจสอบข้อพิพาท"' },
        { label: 'ที่นั่งติด cooldown 15 นาที', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: 'ที่นั่งนี้เพิ่งถูกลบไปโดยใครบางคน — popup แจ้งให้รอ 15 นาทีก่อนลงทะเบียนใหม่ได้' },
        { label: 'เคยตัดสินว่าไม่ใช่ของคุณ', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: 'มีข้อพิพาทก่อนหน้าตัดสินไปแล้วว่าที่นั่งนี้ไม่ใช่ของคุณ — popup แจ้งว่าลงทะเบียนซ้ำไม่ได้' },
        { label: 'ทำรายการเกิน 20 ครั้ง/วัน', color: '#ff6b6b', bg: 'rgba(255,90,90,0.12)', desc: 'วันนี้ลงทะเบียน/แก้ไขไปแล้ว 20 ครั้ง — popup ขอให้ลองใหม่พรุ่งนี้ หรือติดต่อทีมงาน' }
      ],
      example: 'ตัวอย่าง — คุณมีบัตรจริงโซน A1 แถว AG เลข 2 รอบ 23 ต.ค. เลือกรอบ = 23 ต.ค., โซน = A1, แถว = AG, เลขที่นั่ง = 2 → กดลงทะเบียน ถ้าที่นั่งนี้ยังไม่มีใครลงไว้ จะขึ้น popup แจ้งสำเร็จ แล้วสถานะขึ้น "รอยืนยันหลักฐาน" แต่ถ้ามีคนลงทะเบียนที่นั่งนี้ไว้ก่อนแล้ว จะขึ้น popup ถามยืนยันก่อน ("ที่นั่งนี้มีคนลงทะเบียนไว้แล้ว ยืนยันว่าใช่ที่นั่งของคุณจริงไหม") กด "ใช่" เพื่อลงทะเบียนต่อได้ ระบบจะเปิดเป็นข้อพิพาทให้ทีมงานตรวจสอบ (ดูหัวข้อ "จัดการข้อพิพาท")',
      goodToKnow: [
        'ลงทะเบียน (และแก้ไข) ได้สูงสุดรวมกัน 20 ครั้ง/วัน/บัญชี กันสแปม',
        'ที่นั่งที่เพิ่งถูกลบไป ต้องรอ 15 นาทีก่อนถึงจะลงทะเบียนใหม่ได้ (กันคนแย่งจองรัวๆ)',
        'account x.com ของคุณดึงมาจากบัญชี X ที่ login ไว้โดยอัตโนมัติเลย ไม่ต้องตั้งเองแยกขั้นตอนไหนอีก'
      ]
    },
    { key: 'manageTickets', title: 'จัดการบัตรของฉัน',
      summary: 'ดูสถานะ ส่งหลักฐาน แก้ไข หรือลบบัตรที่ลงทะเบียนไว้ — พร้อมประวัติการดำเนินการย้อนหลัง',
      access: ['Login แล้วไปที่ "โปรไฟล์ของฉัน" → แท็บ "จัดการบัตร" → แท็บย่อย "จัดการบัตรของฉัน"'],
      steps: [
        'บัตรแต่ละใบจะมีสถานะกำกับไว้ตามตารางด้านล่าง',
        'กด "ส่งหลักฐาน" เพื่ออัปโหลดรูปภาพยืนยันความเป็นเจ้าของ (เฉพาะไฟล์รูปภาพ ไม่เกิน 2MB) ส่งได้สูงสุด 10 ครั้ง/วัน',
        'กด "แก้ไข" เพื่อเปลี่ยนโซน/แถว/เลขที่นั่ง — ระบบจะเตือนก่อนว่าจะรีเซ็ตสถานะกลับไปรอตรวจสอบใหม่',
        'กด "ลบ" หากลงทะเบียนผิดหรือไม่ต้องการบัตรใบนั้นแล้ว',
        'กด "↻ รีเฟรช" ข้างแท็บ "จัดการบัตรของฉัน / จัดการข้อพิพาท" เมื่อไหร่ก็ได้ เพื่อโหลดข้อมูลล่าสุดโดยไม่ต้อง reload หน้า'
      ],
      statusTable: [
        { label: 'รอยืนยันหลักฐาน', color: '#ffd400', bg: 'rgba(255,212,0,0.12)', desc: 'ลงทะเบียนแล้ว ยังไม่ได้ส่งหลักฐาน — แก้ไข/ลบ/ส่งหลักฐานได้ตามปกติ' },
        { label: 'รอตรวจสอบเอกสาร', color: '#6fb4ff', bg: 'rgba(111,180,255,0.15)', desc: 'ส่งหลักฐานแล้ว กำลังรอทีมงานตรวจ — ยังแก้ไข/ลบได้' },
        { label: 'ยืนยันแล้ว', color: '#6fe0d6', bg: 'rgba(111,224,214,0.15)', desc: 'ผ่านการตรวจสอบแล้ว — สถานะที่ปลอดภัยที่สุด' },
        { label: 'อยู่ระหว่างตรวจสอบข้อพิพาท', color: '#ffb066', bg: 'rgba(255,176,32,0.15)', desc: 'มีคนอื่นอ้างสิทธิ์ที่นั่งเดียวกัน แก้ไข/ลบไม่ได้ ทำได้แค่ส่งหลักฐานเพิ่ม' },
        { label: 'ข้อมูลลงทะเบียนไม่ถูกต้อง', color: '#ff6b6b', bg: 'rgba(255,90,90,0.15)', desc: 'ทีมงานตัดสินแล้วว่าที่นั่งนี้ไม่ใช่ของคุณ พร้อมเหตุผลแนบมา เหลือแค่ปุ่ม "ลบ" เท่านั้น' },
        { label: 'ไม่ผ่านการตรวจสอบเอกสาร', color: '#ff9d3f', bg: 'rgba(255,140,0,0.15)', desc: 'หลักฐานที่ส่งไปไม่ผ่าน พร้อมเหตุผลแนบมา — ยังแก้ไขหรือส่งหลักฐานใหม่เพื่อลองอีกครั้งได้' }
      ],
      example: 'ตัวอย่าง (ไทม์ไลน์จริงของบัตร 1 ใบ) — 10:00 น. ลงทะเบียนที่นั่ง → สถานะ "รอยืนยันหลักฐาน" → 10:05 น. อัปโหลดรูปหลักฐาน → สถานะเปลี่ยนเป็น "รอตรวจสอบเอกสาร" พร้อมนับถอยหลัง 48 ชม. → 11:00 น. มีคนอื่นลงทะเบียนที่นั่งเดียวกันแล้วยืนยันว่าเป็นของเขาจริง → สถานะบัตรของคุณเปลี่ยนเป็น "อยู่ระหว่างตรวจสอบข้อพิพาท" ทันที (ส่งหลักฐานเพิ่มได้ถ้ายังไม่ได้ส่ง) → ทีมงานตัดสิน → ถ้าคุณชนะเคส สถานะกลับเป็น "ยืนยันแล้ว" ถ้าแพ้เคส สถานะเป็น "ข้อมูลลงทะเบียนไม่ถูกต้อง"',
      goodToKnow: [
        'แก้ไขบัตรได้สูงสุด 20 ครั้ง/วัน เหมือนกับตอนลงทะเบียน ส่วนส่งหลักฐานมี limit แยกต่างหากที่ 10 ครั้ง/วัน',
        'บัตรที่ "อยู่ระหว่างตรวจสอบข้อพิพาท" แก้ไข/ลบไม่ได้ ทำได้แค่ส่งหลักฐานเพิ่ม',
        'ข้อมูลการลงทะเบียนทั้งหมดจะถูกลบถาวรภายใน 7 วันหลังจบคอนเสิร์ต'
      ]
    },
    { key: 'manageDisputes', title: 'จัดการข้อพิพาท',
      summary: 'เคสที่มีคนมากกว่า 1 คนอ้างสิทธิ์ที่นั่งเดียวกัน — ดูสถานะและส่งหลักฐานเพิ่มได้จากที่นี่',
      access: ['Login แล้วไปที่ "โปรไฟล์ของฉัน" → แท็บ "จัดการบัตร" → แท็บย่อย "จัดการข้อพิพาท"'],
      steps: [
        'จะเห็นรายการเคสข้อพิพาททั้งหมดที่คุณเกี่ยวข้อง พร้อมสถานะตามตารางด้านล่าง และแถบไทม์ไลน์ (เปิดเคส → ส่งหลักฐาน → ทีมงานตรวจสอบ → ผลตัดสิน)',
        'กด "ส่งหลักฐาน" เพื่อแนบหลักฐานเพิ่มเติมสนับสนุนว่าที่นั่งเป็นของคุณจริง — พอส่งปุ๊บ ขั้น "ทีมงานตรวจสอบ" ในไทม์ไลน์ของคุณจะสว่างทันที ไม่ต้องรอให้อีกฝ่ายส่งก่อน',
        'กด "↻ รีเฟรช" ข้างแท็บเพื่อโหลดข้อมูลล่าสุด หรือกด "ติดต่อทีมงาน" ถ้าต้องการติดต่อโดยตรง — ทั้งสองปุ่มอยู่ข้างแท็บ "จัดการบัตรของฉัน / จัดการข้อพิพาท"'
      ],
      statusTable: [
        { label: 'รอตรวจสอบ', color: '#ffb066', bg: 'rgba(255,176,32,0.12)', desc: 'เคสเปิดอยู่ รอทีมงานเปรียบเทียบหลักฐานทั้งสองฝ่าย' },
        { label: 'รอหลักฐานเพิ่มเติม', color: '#6fb4ff', bg: 'rgba(111,180,255,0.15)', desc: 'ทีมงานขอหลักฐานเพิ่มก่อนตัดสิน เคสยังไม่ปิด' },
        { label: 'บัตรถูกยืนยันว่าเป็นของคุณ', color: '#6fe0d6', bg: 'rgba(111,224,214,0.15)', desc: 'คุณชนะเคส — ไม่มีเหตุผลแนบมา มีแค่โน้ตบอกว่าทีมงานตัดสินจากหลักฐานที่แนบมาเท่านั้น' },
        { label: 'บัตรถูกยืนยันเจ้าของเป็นคนอื่นแล้ว', color: '#ff6b6b', bg: 'rgba(255,90,90,0.15)', desc: 'คุณแพ้เคส พร้อมเหตุผลที่ทีมงานเขียนไว้แนบมาด้วย' },
        { label: 'หาข้อสรุปไม่ได้', color: '#a9c4c2', bg: 'rgba(255,255,255,0.08)', desc: 'ทีมงานสรุปไม่ได้ — บัตรทุกใบในเคสนี้กลับไปเป็น "รอยืนยันหลักฐาน" ให้ส่งหลักฐานเพิ่มหรือแก้ไขข้อมูลได้ใหม่' }
      ],
      example: 'ตัวอย่าง — คุณกับอีกคนต่างลงทะเบียนที่นั่งโซน A1 แถว AG เลข 2 ไว้ทั้งคู่ ทีมงานเปิดเป็นข้อพิพาท 1 เคส ทั้งสองฝ่ายจะไม่เห็นตัวตนกันและกัน แต่ส่งหลักฐาน (สลิป/สกรีนช็อตการจอง) เข้ามาที่แท็บนี้ได้อิสระ พอตัดสินแล้ว ฝ่ายที่ชนะจะเห็น tag เขียว "บัตรถูกยืนยันว่าเป็นของคุณ" ไม่มีเหตุผลแนบมา ส่วนฝ่ายที่แพ้จะเห็น tag แดง "บัตรถูกยืนยันเจ้าของเป็นคนอื่นแล้ว" พร้อมเหตุผลที่ทีมงานเขียนไว้ — ทั้งคู่จะเห็นโน้ตอธิบายเพิ่มว่าทีมงานตัดสินจากหลักฐานที่แนบมาเท่านั้น พร้อมช่องทางติดต่อถ้ายังมีข้อสงสัย',
      goodToKnow: [
        'คนที่ผ่านการตรวจสอบก่อนจะได้สิทธิ์ ไม่ใช่คนที่ลงทะเบียนก่อน เพราะฉะนั้นควรส่งหลักฐานให้เร็วและชัดเจนที่สุด',
        'การส่งหลักฐานเป็นทางเลือก แต่แนะนำให้ส่งเสมอ เพื่อเพิ่มโอกาสชนะเคส',
        'เราจะไม่เปิดเผยตัวตนของผู้อ้างสิทธิ์อีกฝ่ายเด็ดขาด แม้เคสจะปิดไปแล้วก็ตาม กรุณาอย่าคาดเดาในที่สาธารณะ'
      ]
    },
    { key: 'editProfile', title: 'แก้ไขโปรไฟล์',
      summary: 'เปลี่ยนชื่อที่ใช้แสดง อวาตาร์ สีพื้นหลัง',
      access: ['Login แล้วไปที่ "โปรไฟล์ของฉัน" → กดปุ่ม "แก้ไขโปรไฟล์" มุมบน'],
      steps: [
        'เปลี่ยนชื่อที่ใช้แสดง เลือกอวาตาร์และสีพื้นหลังที่ชอบ',
        'กดบันทึก'
      ],
      example: 'ตัวอย่าง — อยากเปลี่ยนจากชื่อ "sakinut" เป็นชื่อเล่นอื่น กด "แก้ไขโปรไฟล์" → พิมพ์ชื่อใหม่ในช่อง "ชื่อที่ใช้แสดง" → กดบันทึก → ชื่อใหม่จะขึ้นทันทีทุกที่ที่เคยโชว์ชื่อเดิม',
      goodToKnow: ['ชื่อที่ใช้แสดงเปลี่ยนได้ไม่จำกัดจำนวนครั้ง ต่างจาก account x.com ที่ตั้งได้ครั้งเดียว']
    },
    { key: 'other', title: 'เมนูอื่นๆ',
      summary: 'เคล็ดลับกดบัตร, LYKN Watchlist, คำถามที่พบบ่อย, Lucky Draw',
      access: ['เมนู ☰ → เลือกเมนูที่ต้องการด้านล่าง'],
      steps: [
        'เคล็ดลับกดบัตร: เทคนิคเตรียมตัวก่อน/ระหว่าง/หลังเข้าคิวจองบัตร',
        'LYKN Watchlist: ซีรีส์และเพลงแนะนำให้ดูก่อนคอนเสิร์ต',
        'คำถามที่พบบ่อย: รวมคำตอบเรื่องการซื้อบัตร รับบัตร ชำระเงิน และ live streaming',
        'Lucky Draw: สุ่มการ์ดพิเศษ'
      ]
    },
    { key: 'conditions', title: 'เงื่อนไขสำคัญที่ควรรู้',
      summary: 'เว็บนี้คืออะไร (และไม่ใช่อะไร) และข้อมูลของคุณถูกจัดการยังไง',
      steps: [
        'เว็บนี้ทำโดยแฟนคลับ ไม่ใช่ช่องทางของผู้จัดงาน ศิลปิน ค่าย หรือผู้ขายบัตร ไม่สามารถยืนยันความแท้ของบัตรได้ และไม่มีส่วนเกี่ยวข้องกับการซื้อขายใดๆ ทั้งสิ้น',
        'ระบบ "ตรวจสอบที่นั่ง" และ "ลงทะเบียนบัตร" อ้างอิงจากข้อมูลที่ผู้ใช้กรอกเอง ไม่ใช่ข้อมูลจากระบบขายบัตรทางการ',
        'ข้อมูลการลงทะเบียนทั้งหมดจะถูกลบถาวรภายใน 7 วันหลังจบคอนเสิร์ต',
        'มีปัญหาหรือข้อสงสัย ติดต่อทีมงานได้ที่ x.com/@susakiiverse (ลิงก์อยู่ท้ายทุกหน้าเว็บ)'
      ]
    }
  ];
}
