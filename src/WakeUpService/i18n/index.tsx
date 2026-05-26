// Lightweight i18n — 5 locales, navigator.language auto-detect,
// localStorage override. Keep LCD system labels (3-5 char codes like
// RNG / FILE / SUBJ / CH / MB / SYS) hardcoded in screens; everything
// else lives here.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'es';
export const LOCALES: Locale[] = ['en', 'zh', 'ja', 'ko', 'es'];
const LS_KEY = 'wakeup_locale';

function detectLocale(): Locale {
  try {
    const override = localStorage.getItem(LS_KEY) as Locale | null;
    if (override && LOCALES.includes(override)) return override;
  } catch {
    /* ignore */
  }
  const lang = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

type Dict = Record<string, string>;

const EN: Dict = {
  // App
  'app.title': 'WAKE-UP',
  'app.subtitle': 'DISPATCH SERVICE',
  'app.brand': 'WAKE-UP SERVICE',
  'common.back': 'BACK',
  'common.demo': '· DEMO ·',

  // Lobby
  'lobby.cta': 'PLACE  WAKE-UP  CALL',
  'lobby.registry_empty': '· REGISTRY EMPTY ·',
  'lobby.asleep_more': '+{n} ASLEEP',
  'lobby.asleep_count': '{n} ASLEEP',

  // Stats
  'stats.dispatched': 'DISPATCHED',
  'stats.total': 'TOTAL',
  'stats.online': 'ONLINE',

  // Ticker
  'ticker.queue': 'QUEUE {n}',
  'ticker.wakeups_tonight': 'WAKE-UPS TONIGHT · {n}',
  'ticker.ops_online': 'OPS ONLINE · {n}',
  'ticker.standing_by': 'OPERATORS STANDING BY · 24/7',

  // Strip
  'strip.live_room': 'LIVE · ROOM 3A',
  'strip.sleeper_registry': 'SLEEPER REGISTRY',
  'strip.target_locked': 'TARGET LOCKED',
  'strip.protocol_catalog': 'PROTOCOL CATALOG',
  'strip.dispatching': 'DISPATCHING',
  'strip.receipt': 'RECEIPT',
  'strip.display_settings': 'DISPLAY SETTINGS',

  // Picker
  'picker.h2': 'SELECT  SLEEPER',
  'picker.subtitle': 'TAP TO TARGET',
  'picker.fetching': 'FETCHING REGISTRY',
  'picker.empty.title': 'NO SLEEPERS REGISTERED',
  'picker.empty.sub': 'ADD A FRIEND IN AIGRAM TO USE THIS SERVICE',
  'picker.last_ping': 'LAST PING · {t} AGO',
  'picker.entries': '{n} ENTRIES',
  'picker.entry': '{n} ENTRY',
  'picker.cta': 'NEXT · TARGET',

  // Stages (medical short codes — kept English universally)
  'stage.deep': 'DEEP',
  'stage.rem': 'REM',
  'stage.light': 'LIGHT',
  'stage.out': 'OUT',

  // Detail
  'detail.meta': 'SLEEPER · ROOM 3A · ID {id}',
  'detail.dossier_l1': 'DOSSIER · DOES NOT HEAR ALARMS',
  'detail.dossier_l2': 'HAS 3 PILLOWS · FAN ON HIGH',
  'detail.dossier_l3': 'WAKES TO CATS · CAFFEINE TOL · 4',
  'detail.cta': 'SET  PROTOCOL',
  'detail.tonight_value': '×4 CALLS',
  'detail.last_ping_value': '0:02 AGO',

  // Method picker
  'method.h2': 'CHOOSE  PROTOCOL',
  'method.subtitle': 'FOR · {name} · {time}',
  'method.cta': 'DISPATCH  NOW',

  // Method content — one block per method
  'method.marching_band.name':  'MARCHING  BAND',
  'method.marching_band.short': 'BAND',
  'method.marching_band.desc':  'BRASS @ 110 DB · DIRECT TO EAR',
  'method.marching_band.dial':  'BRASS  BAND',
  'method.marching_band.msg':   '{sender_name} sent a marching band into your bedroom',

  'method.cats.name':  'ONE  HUNDRED  CATS',
  'method.cats.short': 'CATS',
  'method.cats.desc':  'LICK SWARM · FELINE ASSAULT',
  'method.cats.dial':  '100  CATS',
  'method.cats.msg':   '{sender_name} dispatched 100 cats to lick you awake',

  'method.water.name':  'BUCKET  OF  WATER',
  'method.water.short': 'WATER',
  'method.water.desc':  'SUB-ZERO · GRAVITY ASSISTED',
  'method.water.dial':  'ICE  BUCKET',
  'method.water.msg':   '{sender_name} dumped an ice bucket on you',

  'method.sergeant.name':  'DRILL  SERGEANT',
  'method.sergeant.short': 'SARGE',
  'method.sergeant.desc':  '2 IN. RANGE · ALL-CAPS',
  'method.sergeant.dial':  'DRILL  SARGE',
  'method.sergeant.msg':   '{sender_name} sent a drill sergeant to your bedside',

  'method.robocall.name':  'ROBOCALL  STORM',
  'method.robocall.short': 'CALLS',
  'method.robocall.desc':  'LANDLINE FLOOD · 50× RING',
  'method.robocall.dial':  'ROBOCALL  STORM',
  'method.robocall.msg':   '{sender_name} called you 50 times in a row',

  'method.rooster.name':  'ROOSTER  CHOIR',
  'method.rooster.short': 'ROOSTER',
  'method.rooster.desc':  '10× CHEST-MOUNTED',
  'method.rooster.dial':  'ROOSTER  CHOIR',
  'method.rooster.msg':   '{sender_name} parked 10 roosters on your chest',

  // Dialing
  'dial.dialing': 'DIALING…',
  'dial.enroute': '{verb}  ENROUTE',
  'dial.delivered': '{verb}  DELIVERED',
  'dial.stamp.sent': 'SIGNAL DISPATCHED',
  'dial.stamp.test': 'LOCAL TEST ONLY',
  'dial.payload': 'PAYLOAD · 1.2 MB UPLOADED',
  'dial.signal': 'SIGNAL · 4 BARS · EST. 0:03',
  'dial.room_label': 'SLEEPER · ROOM 3A',

  // Receipt
  'receipt.h2': 'DISPATCH  RECEIPT',
  'receipt.recorded': 'RECORDED · {time}',
  'receipt.subject': 'SUBJECT',
  'receipt.protocol': 'PROTOCOL',
  'receipt.shorthand': 'SHORTHAND',
  'receipt.timestamp': 'TIMESTAMP',
  'receipt.confirmed': 'CONFIRMED',
  'receipt.demo_status': 'DEMO',
  'receipt.countdown': 'RETURN TO LOBBY · {n}',
  'receipt.cta': 'LOBBY  NOW',

  // Settings
  'settings.h2': 'DISPLAY',
  'settings.subtitle': 'CHOOSE YOUR LCD',
  'settings.color': 'COLOR · TINT',
  'settings.typeface': 'TYPEFACE',
  'settings.brightness': 'BRIGHTNESS',
  'settings.language': 'LANGUAGE',
  'settings.reset': 'RESET  TO  DEFAULTS',
  'settings.cta': 'APPLY · DONE',

  // Color names
  'color.crimson.sub': 'ALARM · DEFAULT',
  'color.amber.sub': '70s VINTAGE CLOCK',
  'color.phosphor.sub': 'CRT TERMINAL GREEN',
  'color.cyan.sub': 'ICE STATION',
  'color.synth.sub': 'AFTERHOURS PINK',

  // Font names
  'font.crt.name': 'CRT  DISPLAY',
  'font.pixel.name': 'PIXEL  BLOCK',
  'font.dot.name': 'DOT  MATRIX',
  'font.mono.name': 'MONO  ENG',

  // Language names (always rendered in their own language)
  'locale.en': 'English',
  'locale.zh': '中文',
  'locale.ja': '日本語',
  'locale.ko': '한국어',
  'locale.es': 'Español',

  // Generic
  'sys.gear': 'DISPLAY',
};

const ZH: Dict = {
  'app.title': '唤醒',
  'app.subtitle': '调度服务',
  'app.brand': '唤醒调度',
  'common.back': '返回',
  'common.demo': '· 演示 ·',

  'lobby.cta': '派出唤醒任务',
  'lobby.registry_empty': '· 名册为空 ·',
  'lobby.asleep_more': '+{n} 沉睡中',
  'lobby.asleep_count': '{n} 沉睡中',

  'stats.dispatched': '已派出',
  'stats.total': '累计',
  'stats.online': '在线',

  'ticker.queue': '队列 {n}',
  'ticker.wakeups_tonight': '今夜任务 · {n}',
  'ticker.ops_online': '在岗调度员 · {n}',
  'ticker.standing_by': '调度员 24/7 待命',

  'strip.live_room': '直播 · 3A 室',
  'strip.sleeper_registry': '休眠者名册',
  'strip.target_locked': '目标已锁定',
  'strip.protocol_catalog': '协议目录',
  'strip.dispatching': '派送中',
  'strip.receipt': '回执',
  'strip.display_settings': '显示设置',

  'picker.h2': '选择 目标',
  'picker.subtitle': '点击锁定',
  'picker.fetching': '加载名册',
  'picker.empty.title': '尚未登记任何休眠者',
  'picker.empty.sub': '请先在 AIGRAM 添加好友再使用本服务',
  'picker.last_ping': '最近响动 · {t} 前',
  'picker.entries': '{n} 条记录',
  'picker.entry': '{n} 条记录',
  'picker.cta': '下一步 · 目标',

  'stage.deep': 'DEEP',
  'stage.rem': 'REM',
  'stage.light': 'LIGHT',
  'stage.out': 'OUT',

  'detail.meta': '休眠者 · 3A 室 · 编号 {id}',
  'detail.dossier_l1': '档案 · 闹钟叫不醒',
  'detail.dossier_l2': '三个枕头 · 风扇最大档',
  'detail.dossier_l3': '怕猫吵 · 咖啡耐受度 4 级',
  'detail.cta': '选择 协议',
  'detail.tonight_value': '×4 次呼叫',
  'detail.last_ping_value': '0:02 前',

  'method.h2': '选择 协议',
  'method.subtitle': '致 · {name} · {time}',
  'method.cta': '立即 派送',

  'method.marching_band.name':  '行进 乐队',
  'method.marching_band.short': '乐队',
  'method.marching_band.desc':  '110 分贝铜管 · 贴耳吹奏',
  'method.marching_band.dial':  '行进 乐队',
  'method.marching_band.msg':   '{sender_name} 派了一支行进乐队进你卧室',

  'method.cats.name':  '一百 只猫',
  'method.cats.short': '猫群',
  'method.cats.desc':  '舔舐 围攻 · 猫科入侵',
  'method.cats.dial':  '100  只猫',
  'method.cats.msg':   '{sender_name} 派了 100 只猫来舔醒你',

  'method.water.name':  '一桶 冰水',
  'method.water.short': '冰水',
  'method.water.desc':  '零度以下 · 重力加持',
  'method.water.dial':  '冰桶 浇灌',
  'method.water.msg':   '{sender_name} 给你浇了一桶冰水',

  'method.sergeant.name':  '魔鬼 教官',
  'method.sergeant.short': '教官',
  'method.sergeant.desc':  '5 厘米射程 · 全大写',
  'method.sergeant.dial':  '教官 咆哮',
  'method.sergeant.msg':   '{sender_name} 派教官在你床边咆哮',

  'method.robocall.name':  '骚扰 电话 风暴',
  'method.robocall.short': '电话',
  'method.robocall.desc':  '座机轰炸 · 50 次响铃',
  'method.robocall.dial':  '电话 风暴',
  'method.robocall.msg':   '{sender_name} 连打你 50 个电话',

  'method.rooster.name':  '公鸡 合唱团',
  'method.rooster.short': '公鸡',
  'method.rooster.desc':  '10 只 · 胸前部署',
  'method.rooster.dial':  '公鸡 合唱',
  'method.rooster.msg':   '{sender_name} 在你胸口放了 10 只公鸡',

  'dial.dialing': '拨号中…',
  'dial.enroute': '{verb}  派送中',
  'dial.delivered': '{verb}  已送达',
  'dial.stamp.sent': '信号 已派出',
  'dial.stamp.test': '本地 测试',
  'dial.payload': '负载 · 已上传 1.2 MB',
  'dial.signal': '信号 · 4 格 · 预计 0:03',
  'dial.room_label': '休眠者 · 3A 室',

  'receipt.h2': '派送 回执',
  'receipt.recorded': '记录 · {time}',
  'receipt.subject': '对象',
  'receipt.protocol': '协议',
  'receipt.shorthand': '简码',
  'receipt.timestamp': '时间戳',
  'receipt.confirmed': '已确认',
  'receipt.demo_status': '演示',
  'receipt.countdown': '返回大厅 · {n}',
  'receipt.cta': '立即 返回',

  'settings.h2': '显示',
  'settings.subtitle': '调整你的 LCD',
  'settings.color': '颜色 · 色调',
  'settings.typeface': '字体',
  'settings.brightness': '亮度',
  'settings.language': '语言',
  'settings.reset': '恢复 默认',
  'settings.cta': '应用 · 完成',

  'color.crimson.sub': '警报 · 默认',
  'color.amber.sub': '70 年代复古',
  'color.phosphor.sub': 'CRT 终端绿',
  'color.cyan.sub': '冰冻站',
  'color.synth.sub': '深夜粉',

  'font.crt.name': 'CRT 显示',
  'font.pixel.name': '像素 方块',
  'font.dot.name': '点阵 矩阵',
  'font.mono.name': '工程 等宽',

  'locale.en': 'English',
  'locale.zh': '中文',
  'locale.ja': '日本語',
  'locale.ko': '한국어',
  'locale.es': 'Español',

  'sys.gear': '显示',
};

const JA: Dict = {
  'app.title': 'モーニング',
  'app.subtitle': 'コール センター',
  'app.brand': 'モーニングコール',
  'common.back': '戻る',
  'common.demo': '· デモ ·',

  'lobby.cta': 'モーニング コール を 送る',
  'lobby.registry_empty': '· 名簿 空 ·',
  'lobby.asleep_more': '+{n} 名 就寝中',
  'lobby.asleep_count': '{n} 名 就寝中',

  'stats.dispatched': '発信済',
  'stats.total': '累計',
  'stats.online': 'オンライン',

  'ticker.queue': 'キュー {n}',
  'ticker.wakeups_tonight': '今夜 の 任務 · {n}',
  'ticker.ops_online': 'オペレーター · {n}',
  'ticker.standing_by': 'オペレーター 24/7 待機中',

  'strip.live_room': 'ライブ · 3A 号室',
  'strip.sleeper_registry': '就寝者 名簿',
  'strip.target_locked': '対象 ロック',
  'strip.protocol_catalog': 'プロトコル 目録',
  'strip.dispatching': '発信中',
  'strip.receipt': '受信書',
  'strip.display_settings': '画面 設定',

  'picker.h2': '対象 を 選択',
  'picker.subtitle': 'タップ で ロック',
  'picker.fetching': '名簿 読込中',
  'picker.empty.title': '就寝者 が 登録 されて いません',
  'picker.empty.sub': 'AIGRAM で 友達 を 追加 して ください',
  'picker.last_ping': '最終 反応 · {t} 前',
  'picker.entries': '{n} 件',
  'picker.entry': '{n} 件',
  'picker.cta': '次へ · 対象',

  'stage.deep': 'DEEP',
  'stage.rem': 'REM',
  'stage.light': 'LIGHT',
  'stage.out': 'OUT',

  'detail.meta': '就寝者 · 3A 号室 · ID {id}',
  'detail.dossier_l1': '記録 · 目覚まし に 反応 せず',
  'detail.dossier_l2': '枕 三つ · 扇風機 強',
  'detail.dossier_l3': '猫 で 起床 · カフェイン 耐性 4',
  'detail.cta': 'プロトコル 選択',
  'detail.tonight_value': '×4 回',
  'detail.last_ping_value': '0:02 前',

  'method.h2': 'プロトコル 選択',
  'method.subtitle': '対象 · {name} · {time}',
  'method.cta': '今すぐ 発信',

  'method.marching_band.name':  'マーチング バンド',
  'method.marching_band.short': 'バンド',
  'method.marching_band.desc':  '金管 110 デシベル · 耳元 直撃',
  'method.marching_band.dial':  'マーチング バンド',
  'method.marching_band.msg':   '{sender_name} さん が マーチングバンド を 寝室 に 送り込みました',

  'method.cats.name':  '猫 百匹',
  'method.cats.short': '猫',
  'method.cats.desc':  '舐め 攻撃 · ネコ科 襲撃',
  'method.cats.dial':  '猫 100 匹',
  'method.cats.msg':   '{sender_name} さん が 100 匹 の 猫 を 派遣 しました',

  'method.water.name':  '氷水 バケツ',
  'method.water.short': '氷水',
  'method.water.desc':  '零下 · 重力 落下',
  'method.water.dial':  '氷水 バケツ',
  'method.water.msg':   '{sender_name} さん が 氷水 を かけました',

  'method.sergeant.name':  '鬼 教官',
  'method.sergeant.short': '教官',
  'method.sergeant.desc':  '5 cm 至近 · 大声 怒号',
  'method.sergeant.dial':  '鬼 教官',
  'method.sergeant.msg':   '{sender_name} さん が 鬼教官 を 枕元 に 派遣 しました',

  'method.robocall.name':  '電話 嵐',
  'method.robocall.short': '電話',
  'method.robocall.desc':  '固定 電話 50 回 着信',
  'method.robocall.dial':  '電話 嵐',
  'method.robocall.msg':   '{sender_name} さん が 50 回 連続 で 電話 を かけました',

  'method.rooster.name':  '雄鶏 合唱',
  'method.rooster.short': '雄鶏',
  'method.rooster.desc':  '10 羽 · 胸 に 配置',
  'method.rooster.dial':  '雄鶏 合唱',
  'method.rooster.msg':   '{sender_name} さん が 胸 に 10 羽 の 雄鶏 を 置きました',

  'dial.dialing': '発信中…',
  'dial.enroute': '{verb}  派遣中',
  'dial.delivered': '{verb}  到着',
  'dial.stamp.sent': '信号 送信 完了',
  'dial.stamp.test': 'ローカル テスト',
  'dial.payload': 'ペイロード · 1.2 MB アップロード',
  'dial.signal': '信号 · 4 本 · 予測 0:03',
  'dial.room_label': '就寝者 · 3A 号室',

  'receipt.h2': '派遣 受信書',
  'receipt.recorded': '記録 · {time}',
  'receipt.subject': '対象',
  'receipt.protocol': 'プロトコル',
  'receipt.shorthand': '短縮符',
  'receipt.timestamp': 'タイムスタンプ',
  'receipt.confirmed': '確認 済',
  'receipt.demo_status': 'デモ',
  'receipt.countdown': 'ロビー へ · {n}',
  'receipt.cta': '今すぐ 戻る',

  'settings.h2': '画面',
  'settings.subtitle': 'LCD を 選ぶ',
  'settings.color': '色調',
  'settings.typeface': '書体',
  'settings.brightness': '輝度',
  'settings.language': '言語',
  'settings.reset': '初期 設定 に 戻す',
  'settings.cta': '適用 · 完了',

  'color.crimson.sub': 'アラーム · 既定',
  'color.amber.sub': '70 年代 時計',
  'color.phosphor.sub': 'CRT ターミナル 緑',
  'color.cyan.sub': 'アイス ステーション',
  'color.synth.sub': '深夜 ピンク',

  'font.crt.name': 'CRT 表示',
  'font.pixel.name': 'ピクセル',
  'font.dot.name': 'ドット マトリクス',
  'font.mono.name': '等幅 モノ',

  'locale.en': 'English',
  'locale.zh': '中文',
  'locale.ja': '日本語',
  'locale.ko': '한국어',
  'locale.es': 'Español',

  'sys.gear': '設定',
};

const KO: Dict = {
  'app.title': '모닝콜',
  'app.subtitle': '디스패치 서비스',
  'app.brand': '모닝콜 서비스',
  'common.back': '뒤로',
  'common.demo': '· 데모 ·',

  'lobby.cta': '모닝콜 보내기',
  'lobby.registry_empty': '· 명부 비어있음 ·',
  'lobby.asleep_more': '+{n} 명 취침중',
  'lobby.asleep_count': '{n} 명 취침중',

  'stats.dispatched': '발송됨',
  'stats.total': '누적',
  'stats.online': '온라인',

  'ticker.queue': '대기열 {n}',
  'ticker.wakeups_tonight': '오늘 밤 작업 · {n}',
  'ticker.ops_online': '근무중 · {n}',
  'ticker.standing_by': '운영자 24/7 대기',

  'strip.live_room': '실시간 · 3A 호',
  'strip.sleeper_registry': '취침자 명부',
  'strip.target_locked': '대상 잠금',
  'strip.protocol_catalog': '프로토콜 목록',
  'strip.dispatching': '발송중',
  'strip.receipt': '영수증',
  'strip.display_settings': '디스플레이 설정',

  'picker.h2': '대상 선택',
  'picker.subtitle': '탭하여 지정',
  'picker.fetching': '명부 불러오는 중',
  'picker.empty.title': '등록된 취침자 없음',
  'picker.empty.sub': 'AIGRAM 에서 친구를 추가하세요',
  'picker.last_ping': '마지막 신호 · {t} 전',
  'picker.entries': '{n} 명',
  'picker.entry': '{n} 명',
  'picker.cta': '다음 · 대상',

  'stage.deep': 'DEEP',
  'stage.rem': 'REM',
  'stage.light': 'LIGHT',
  'stage.out': 'OUT',

  'detail.meta': '취침자 · 3A 호 · ID {id}',
  'detail.dossier_l1': '기록 · 알람 안 들음',
  'detail.dossier_l2': '베개 3개 · 선풍기 강',
  'detail.dossier_l3': '고양이로 깨움 · 카페인 내성 4',
  'detail.cta': '프로토콜 선택',
  'detail.tonight_value': '×4 통화',
  'detail.last_ping_value': '0:02 전',

  'method.h2': '프로토콜 선택',
  'method.subtitle': '대상 · {name} · {time}',
  'method.cta': '지금 발송',

  'method.marching_band.name':  '행진 악단',
  'method.marching_band.short': '악단',
  'method.marching_band.desc':  '110 데시벨 금관 · 귀에 직격',
  'method.marching_band.dial':  '행진 악단',
  'method.marching_band.msg':   '{sender_name} 님이 행진 악단을 침실에 보냈습니다',

  'method.cats.name':  '고양이 백 마리',
  'method.cats.short': '고양이',
  'method.cats.desc':  '핥기 공격 · 묘과 침공',
  'method.cats.dial':  '고양이 100마리',
  'method.cats.msg':   '{sender_name} 님이 100 마리의 고양이를 보냈습니다',

  'method.water.name':  '얼음물 양동이',
  'method.water.short': '얼음물',
  'method.water.desc':  '영하 · 중력 가속',
  'method.water.dial':  '얼음 양동이',
  'method.water.msg':   '{sender_name} 님이 얼음물을 부었습니다',

  'method.sergeant.name':  '훈련 교관',
  'method.sergeant.short': '교관',
  'method.sergeant.desc':  '5 cm 거리 · 큰소리',
  'method.sergeant.dial':  '훈련 교관',
  'method.sergeant.msg':   '{sender_name} 님이 훈련 교관을 보냈습니다',

  'method.robocall.name':  '전화 폭풍',
  'method.robocall.short': '전화',
  'method.robocall.desc':  '유선 전화 50 회 연속',
  'method.robocall.dial':  '전화 폭풍',
  'method.robocall.msg':   '{sender_name} 님이 50번 연속으로 전화했습니다',

  'method.rooster.name':  '수탉 합창',
  'method.rooster.short': '수탉',
  'method.rooster.desc':  '10 마리 · 가슴 배치',
  'method.rooster.dial':  '수탉 합창',
  'method.rooster.msg':   '{sender_name} 님이 가슴에 수탉 10마리를 올렸습니다',

  'dial.dialing': '연결중…',
  'dial.enroute': '{verb}  배송중',
  'dial.delivered': '{verb}  도착',
  'dial.stamp.sent': '신호 발송 완료',
  'dial.stamp.test': '로컬 테스트',
  'dial.payload': '페이로드 · 1.2 MB 업로드',
  'dial.signal': '신호 · 4 칸 · 예상 0:03',
  'dial.room_label': '취침자 · 3A 호',

  'receipt.h2': '발송 영수증',
  'receipt.recorded': '기록 · {time}',
  'receipt.subject': '대상',
  'receipt.protocol': '프로토콜',
  'receipt.shorthand': '단축',
  'receipt.timestamp': '타임스탬프',
  'receipt.confirmed': '확인됨',
  'receipt.demo_status': '데모',
  'receipt.countdown': '로비로 · {n}',
  'receipt.cta': '지금 돌아가기',

  'settings.h2': '디스플레이',
  'settings.subtitle': 'LCD 선택',
  'settings.color': '색상',
  'settings.typeface': '글꼴',
  'settings.brightness': '밝기',
  'settings.language': '언어',
  'settings.reset': '기본값 복원',
  'settings.cta': '적용 · 완료',

  'color.crimson.sub': '경보 · 기본',
  'color.amber.sub': '70 년대 시계',
  'color.phosphor.sub': 'CRT 단말 녹색',
  'color.cyan.sub': '아이스 스테이션',
  'color.synth.sub': '심야 핑크',

  'font.crt.name': 'CRT 디스플레이',
  'font.pixel.name': '픽셀 블록',
  'font.dot.name': '도트 매트릭스',
  'font.mono.name': '모노 엔지니어',

  'locale.en': 'English',
  'locale.zh': '中文',
  'locale.ja': '日本語',
  'locale.ko': '한국어',
  'locale.es': 'Español',

  'sys.gear': '설정',
};

const ES: Dict = {
  'app.title': 'DESPIERTA',
  'app.subtitle': 'SERVICIO DE ENVÍOS',
  'app.brand': 'SERVICIO DESPIERTA',
  'common.back': 'ATRÁS',
  'common.demo': '· DEMO ·',

  'lobby.cta': 'ENVIAR  LLAMADA  DESPIERTA',
  'lobby.registry_empty': '· REGISTRO VACÍO ·',
  'lobby.asleep_more': '+{n} DURMIENDO',
  'lobby.asleep_count': '{n} DURMIENDO',

  'stats.dispatched': 'ENVIADAS',
  'stats.total': 'TOTAL',
  'stats.online': 'EN LÍNEA',

  'ticker.queue': 'COLA {n}',
  'ticker.wakeups_tonight': 'ESTA NOCHE · {n}',
  'ticker.ops_online': 'OPERADORES · {n}',
  'ticker.standing_by': 'OPERADORES 24/7',

  'strip.live_room': 'EN VIVO · SALA 3A',
  'strip.sleeper_registry': 'REGISTRO DE DURMIENTES',
  'strip.target_locked': 'OBJETIVO FIJADO',
  'strip.protocol_catalog': 'CATÁLOGO DE PROTOCOLOS',
  'strip.dispatching': 'ENVIANDO',
  'strip.receipt': 'RECIBO',
  'strip.display_settings': 'AJUSTES DE PANTALLA',

  'picker.h2': 'ELEGIR  DURMIENTE',
  'picker.subtitle': 'TOCA PARA FIJAR',
  'picker.fetching': 'CARGANDO REGISTRO',
  'picker.empty.title': 'SIN DURMIENTES REGISTRADOS',
  'picker.empty.sub': 'AÑADE UN AMIGO EN AIGRAM PARA USAR ESTE SERVICIO',
  'picker.last_ping': 'ÚLTIMA SEÑAL · HACE {t}',
  'picker.entries': '{n} ENTRADAS',
  'picker.entry': '{n} ENTRADA',
  'picker.cta': 'SIGUIENTE · OBJETIVO',

  'stage.deep': 'DEEP',
  'stage.rem': 'REM',
  'stage.light': 'LIGHT',
  'stage.out': 'OUT',

  'detail.meta': 'DURMIENTE · SALA 3A · ID {id}',
  'detail.dossier_l1': 'EXPEDIENTE · NO OYE ALARMAS',
  'detail.dossier_l2': '3 ALMOHADAS · VENTILADOR ALTO',
  'detail.dossier_l3': 'DESPIERTA CON GATOS · CAFEÍNA 4',
  'detail.cta': 'FIJAR  PROTOCOLO',
  'detail.tonight_value': '×4 LLAMADAS',
  'detail.last_ping_value': 'HACE 0:02',

  'method.h2': 'ELEGIR  PROTOCOLO',
  'method.subtitle': 'PARA · {name} · {time}',
  'method.cta': 'ENVIAR  YA',

  'method.marching_band.name':  'BANDA  MILITAR',
  'method.marching_band.short': 'BANDA',
  'method.marching_band.desc':  'METALES 110 DB · AL OÍDO',
  'method.marching_band.dial':  'BANDA  MILITAR',
  'method.marching_band.msg':   '{sender_name} envió una banda militar a tu cuarto',

  'method.cats.name':  'CIEN  GATOS',
  'method.cats.short': 'GATOS',
  'method.cats.desc':  'ENJAMBRE FELINO · LAMIDAS',
  'method.cats.dial':  '100  GATOS',
  'method.cats.msg':   '{sender_name} despachó 100 gatos para lamerte',

  'method.water.name':  'BALDE  DE  HIELO',
  'method.water.short': 'HIELO',
  'method.water.desc':  'BAJO CERO · POR GRAVEDAD',
  'method.water.dial':  'BALDE  DE  HIELO',
  'method.water.msg':   '{sender_name} te tiró un balde de hielo',

  'method.sergeant.name':  'SARGENTO  GRITÓN',
  'method.sergeant.short': 'SARGE',
  'method.sergeant.desc':  '5 CM · TODO EN MAYÚSCULAS',
  'method.sergeant.dial':  'SARGENTO',
  'method.sergeant.msg':   '{sender_name} envió un sargento a tu cama',

  'method.robocall.name':  'TORMENTA  DE  LLAMADAS',
  'method.robocall.short': 'LLAMA',
  'method.robocall.desc':  'TELÉFONO FIJO · 50 TIMBRES',
  'method.robocall.dial':  'TORMENTA  LLAMADAS',
  'method.robocall.msg':   '{sender_name} te llamó 50 veces seguidas',

  'method.rooster.name':  'CORO  DE  GALLOS',
  'method.rooster.short': 'GALLOS',
  'method.rooster.desc':  '10 GALLOS · EN TU PECHO',
  'method.rooster.dial':  'CORO  GALLOS',
  'method.rooster.msg':   '{sender_name} dejó 10 gallos en tu pecho',

  'dial.dialing': 'MARCANDO…',
  'dial.enroute': '{verb}  EN CAMINO',
  'dial.delivered': '{verb}  ENTREGADO',
  'dial.stamp.sent': 'SEÑAL ENVIADA',
  'dial.stamp.test': 'PRUEBA LOCAL',
  'dial.payload': 'CARGA · 1.2 MB SUBIDA',
  'dial.signal': 'SEÑAL · 4 BARRAS · EST. 0:03',
  'dial.room_label': 'DURMIENTE · SALA 3A',

  'receipt.h2': 'RECIBO  DE  ENVÍO',
  'receipt.recorded': 'REGISTRADO · {time}',
  'receipt.subject': 'SUJETO',
  'receipt.protocol': 'PROTOCOLO',
  'receipt.shorthand': 'SIGLA',
  'receipt.timestamp': 'MARCA TIEMPO',
  'receipt.confirmed': 'CONFIRMADO',
  'receipt.demo_status': 'DEMO',
  'receipt.countdown': 'A LOBBY · {n}',
  'receipt.cta': 'AL  LOBBY',

  'settings.h2': 'PANTALLA',
  'settings.subtitle': 'ELIGE TU LCD',
  'settings.color': 'COLOR · TINTE',
  'settings.typeface': 'TIPOGRAFÍA',
  'settings.brightness': 'BRILLO',
  'settings.language': 'IDIOMA',
  'settings.reset': 'RESTABLECER',
  'settings.cta': 'APLICAR · OK',

  'color.crimson.sub': 'ALARMA · DEFECTO',
  'color.amber.sub': 'RELOJ AÑOS 70',
  'color.phosphor.sub': 'CRT TERMINAL VERDE',
  'color.cyan.sub': 'ESTACIÓN POLAR',
  'color.synth.sub': 'ROSA NOCTURNO',

  'font.crt.name': 'CRT  PANTALLA',
  'font.pixel.name': 'PÍXEL  BLOQUE',
  'font.dot.name': 'MATRIZ  PUNTO',
  'font.mono.name': 'MONO  ENG',

  'locale.en': 'English',
  'locale.zh': '中文',
  'locale.ja': '日本語',
  'locale.ko': '한국어',
  'locale.es': 'Español',

  'sys.gear': 'PANTALLA',
};

const DICTS: Record<Locale, Dict> = { en: EN, zh: ZH, ja: JA, ko: KO, es: ES };

// ─── Context ───────────────────────────────────────────────────────────────

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<LocaleCtx | null>(null);

function formatVars(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  let out = s;
  for (const k in vars) {
    out = out.split(`{${k}}`).join(String(vars[k]));
  }
  return out;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LS_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  // Stable t() that closes over the latest locale via useMemo dep
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const dict = DICTS[locale] || EN;
      const raw = dict[key] ?? EN[key] ?? key;
      return formatVars(raw, vars);
    },
    [locale],
  );

  // Reflect locale to <html lang=...> so screen readers + browsers know
  useEffect(() => {
    try {
      document.documentElement.lang = locale;
    } catch {
      /* ignore */
    }
  }, [locale]);

  const value = useMemo<LocaleCtx>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale(): LocaleCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLocale must be used inside <LocaleProvider>');
  return v;
}
