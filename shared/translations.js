// ข้อความสองภาษา + ข้อมูลที่ผูกกับภาษา ใช้ร่วมกันทุกหน้า (แต่ละหน้าโหลดไฟล์นี้ผ่าน <script src>)

function buildTranslations(en) {
  return {
    home: {
      dateLine: en ? 'October 24-25, 2026  |  Impact Arena, Muang Thong Thani' : '24 - 25 ตุลาคม 2569  |  อิมแพ็ค อารีน่า เมืองทองธานี',
      concertLabel: en ? 'Concert starts in' : 'วันจัดคอนเสิร์ตในอีก',
      concertNote: en ? 'Saturday, Oct 24 & Sunday, Oct 25, 2026' : 'เสาร์ที่ 24 และ อาทิตย์ที่ 25 ตุลาคม 2569',
      ctaDetails: en ? 'View Concert Details' : 'ดูรายละเอียดคอนเสิร์ต'
    },
    currency: en ? 'THB' : 'บาท',
    details: {
      title: en ? 'Concert Details' : 'รายละเอียดคอนเสิร์ต',
      subtitle: en ? 'LYKN REFLEXION CONCERT — October 24-25, 2026' : 'LYKN REFLEXION CONCERT — 24-25 ตุลาคม 2569',
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
      notOpenNote: en ? 'Concert ticket verification feature — coming soon' : 'ฟีเจอร์ตรวจสอบบัตรคอนเสิร์ต พบกันเร็วๆนี้ ⏰',
      mapInstruction: en ? 'Click the zone you want to see seat details' : 'คลิกที่โซนที่ต้องการเพื่อดูรายละเอียดที่นั่ง',
      mapHint: en
        ? 'The camera view shown is a rough approximation, and row/seat numbers are referenced only from other concerts held at this same venue — not confirmed LYKN data.'
        : 'มุมมองที่แสดงเป็นการคาดการณ์คร่าวๆ และเลขแถว/ที่นั่งอ้างอิงจากคอนเสิร์ตอื่นๆ ที่จัดในสถานที่เดียวกันเท่านั้น ยังไม่ใช่ข้อมูลยืนยันของ LYKN REFLEXION CONCERT',
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
      submitDisabled: en ? 'Confirm (disabled)' : 'ยืนยัน (ปิดใช้งาน)'
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
        'ทุกกรณีที่ใช้สำเนาบัตร สำเนาต้องเขียนระบุ: มอบอำนาจ / เลขออเดอร์ / ชื่อผู้มารับ'      ],
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
    }
  };
}

function scheduleDataTh() {
  return [
    { dateLabel: 'เสาร์ 22 ส.ค. 2569', time: '09:00', label: 'ระบบคิวออนไลน์เปิดให้เข้าคิวที่ thaiticketmajor.com', dt: '2026-08-22T09:00:00+07:00' },
    { dateLabel: 'เสาร์ 22 ส.ค. 2569', time: '10:00', label: 'เปิดจำหน่ายบัตรออนไลน์ (thaiticketmajor.com)', dt: '2026-08-22T10:00:00+07:00' },
    { dateLabel: 'อาทิตย์ 23 ส.ค. 2569', time: '10:00', label: 'เปิดจำหน่ายทุกช่องทางตามปกติ', dt: '2026-08-23T10:00:00+07:00' },
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
