#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['ko', 'en', 'ja', 'zh-cn', 'zh-tw'];
const LEGAL_PAGES = ['contact', 'privacy', 'terms'];
const DATE_TEXT = {
  ko: '2026년 3월 6일',
  en: 'March 6, 2026',
  ja: '2026年3月6日',
  'zh-cn': '2026年3月6日',
  'zh-tw': '2026年3月6日'
};

const I18N = {
  ko: {
    siteName: 'Randomly Pick',
    homeLabel: '홈으로 돌아가기',
    homePath: '/',
    contact: {
      title: '문의하기 | Randomly Pick',
      description: 'Randomly Pick 문의 페이지입니다. 버그 제보, 광고·제휴, 서비스 문의를 이메일로 받습니다.',
      heading: '문의하기',
      intro: '서비스 문의, 버그 제보, 광고·제휴 요청은 아래 이메일로 보내주세요.',
      emailLabel: '이메일',
      detail1: '오류 제보 시에는 페이지 주소, 사용 언어, 기기 종류, 브라우저 정보를 함께 보내주시면 재현과 수정이 빨라집니다.',
      detail2: '광고 검토나 제휴 문의는 목적과 노출 위치, 기간을 함께 적어주시면 확인이 수월합니다.'
    },
    privacy: {
      title: '개인정보처리방침 | Randomly Pick',
      description: 'Randomly Pick 개인정보처리방침입니다. 랜덤 추첨 도구 이용 과정에서 처리되는 정보와 목적을 설명합니다.',
      heading: '개인정보처리방침',
      effective: '시행일: 2026년 3월 6일',
      lead: 'Randomly Pick은 룰렛, 번호 추첨기, 사다리타기, 코인 던지기, 주사위 굴리기 같은 브라우저 기반 추첨 도구를 제공합니다. 이 문서는 사이트 운영 과정에서 어떤 정보를 어떻게 처리하는지 설명합니다.',
      sections: [
        {
          title: '1. 어떤 정보를 처리하나요?',
          bullets: [
            '방문 시점, 브라우저 종류, 기기 정보, IP 주소 같은 기본 접속 로그가 수집될 수 있습니다.',
            '문의 메일을 보내면 이름, 이메일 주소, 문의 내용이 처리됩니다.',
            '참가자 명단과 추첨 결과 같은 도구 입력값은 기본적으로 사용자의 브라우저 안에서 처리됩니다.'
          ]
        },
        {
          title: '2. 왜 이 정보를 사용하나요?',
          bullets: [
            '사이트를 안정적으로 운영하고 오류를 수정하기 위해 사용합니다.',
            '악성 이용이나 비정상 트래픽을 탐지하고 보안 수준을 유지하기 위해 사용합니다.',
            '문의 응답, 제휴 검토, 광고 운영 같은 커뮤니케이션을 처리하기 위해 사용합니다.',
            '방문 통계와 광고 성과를 파악해 서비스 품질을 개선하기 위해 사용합니다.'
          ]
        },
        {
          title: '3. 브라우저 내부 처리',
          body: 'Randomly Pick의 핵심 추첨 기능은 브라우저 안에서 동작하도록 설계되어 있습니다. 사용자가 입력한 명단과 현재 추첨 상태는 별도 전송이 필요한 외부 서비스가 없는 한 서버에 저장되지 않습니다.'
        },
        {
          title: '4. 쿠키와 외부 서비스',
          body: '사이트는 기본 기능, 방문 분석, 광고 운영을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다. 또한 Google AdSense, Google Analytics, Google Tag Manager, Microsoft Clarity, Userback 같은 외부 서비스를 사용할 수 있으며, 이들 서비스는 각자의 정책에 따라 데이터를 처리할 수 있습니다.'
        },
        {
          title: '5. 보관 기간과 이용자 권리',
          body: '관련 법령이나 운영 목적이 허용하는 범위 안에서 필요한 기간 동안만 정보를 보관합니다. 적용 가능한 법률이 있는 경우, 이용자는 열람·정정·삭제를 요청할 수 있습니다.'
        },
        {
          title: '6. 문의',
          body: '개인정보 처리와 관련한 질문은 newgotae@gmail.com 으로 보내주세요.'
        }
      ]
    },
    terms: {
      title: '이용약관 | Randomly Pick',
      description: 'Randomly Pick 이용약관입니다. 온라인 랜덤 추첨 도구 이용 범위와 기본 조건을 안내합니다.',
      heading: '이용약관',
      effective: '시행일: 2026년 3월 6일',
      lead: '이 약관은 Randomly Pick과 그 안의 브라우저 기반 랜덤 추첨 도구를 이용할 때 적용되는 기본 조건을 설명합니다.',
      sections: [
        {
          title: '1. 서비스 범위',
          body: '사이트는 무료 온라인 추첨 도구를 제공합니다. 기능과 화면, 제공 방식은 운영상 필요에 따라 추가·변경·중단될 수 있습니다.'
        },
        {
          title: '2. 허용되지 않는 사용',
          bullets: [
            '불법적이거나 타인에게 피해를 주는 방식으로 사이트를 사용하면 안 됩니다.',
            '서비스 안정성, 보안, 가용성을 방해하는 시도를 해서는 안 됩니다.',
            '법률이나 권리를 침해하는 방식으로 사이트를 복제, 수집, 재배포해서는 안 됩니다.'
          ]
        },
        {
          title: '3. 지식재산권',
          body: '사이트의 디자인, 브랜드, 코드, 문서, 시각 자료는 Randomly Pick 또는 적법한 권리 보유자에게 권리가 있습니다. 별도 허가 없는 상업적 재사용은 금지됩니다.'
        },
        {
          title: '4. 보증 제한',
          body: '사이트는 현재 상태 그대로 제공됩니다. 중단 없는 동작, 특정 목적 적합성, 무오류 상태를 보증하지 않습니다.'
        },
        {
          title: '5. 외부 서비스와 광고',
          body: '사이트는 외부 분석 도구, 고객지원 도구, 광고 서비스를 사용할 수 있습니다. 해당 서비스 이용에는 각 제공자의 약관과 정책이 추가로 적용될 수 있습니다.'
        },
        {
          title: '6. 약관 변경과 문의',
          body: '약관은 운영상 필요에 따라 바뀔 수 있으며, 변경 후 계속 이용하면 개정 약관에 동의한 것으로 봅니다. 서비스 관련 문의는 newgotae@gmail.com 으로 보내주세요.'
        }
      ]
    }
  },
  en: {
    siteName: 'Randomly Pick',
    homeLabel: 'Back to Home',
    homePath: '/en/',
    contact: {
      title: 'Contact | Randomly Pick',
      description: 'Contact Randomly Pick for support, bug reports, advertising, and partnership inquiries.',
      heading: 'Contact',
      intro: 'For support, bug reports, advertising, or partnership inquiries, contact us by email.',
      emailLabel: 'Email',
      detail1: 'When reporting an issue, include the page URL, language, device type, and browser so we can reproduce it quickly.',
      detail2: 'For advertising or partnership requests, include your goal, preferred placement, and schedule.'
    },
    privacy: {
      title: 'Privacy Policy | Randomly Pick',
      description: 'Privacy Policy for Randomly Pick random tools including wheel, lucky draw, ladder, coin flip, and dice.',
      heading: 'Privacy Policy',
      effective: 'Effective date: March 6, 2026',
      lead: 'Randomly Pick provides browser-based random tools such as wheel spinner, lucky draw, ladder draw, coin flip, and dice roll. This page explains what information may be processed when you use the site.',
      sections: [
        {
          title: '1. What information may be processed?',
          bullets: [
            'Basic access data such as visit time, browser type, device information, and IP address may be collected.',
            'If you contact us, your name, email address, and message content may be processed.',
            'Tool inputs such as participant lists and draw results are generally handled inside your browser.'
          ]
        },
        {
          title: '2. Why do we use this information?',
          bullets: [
            'To operate the site reliably and fix errors.',
            'To detect abuse, defend security, and maintain availability.',
            'To respond to support, partnership, and advertising inquiries.',
            'To understand traffic and advertising performance so we can improve the service.'
          ]
        },
        {
          title: '3. Browser-local processing',
          body: 'The core random-draw features are designed to run in your browser. Participant lists and draw state are not stored on our servers unless a third-party integration specifically requires it.'
        },
        {
          title: '4. Cookies and third-party services',
          body: 'The site may use cookies or similar technologies for core functionality, analytics, and advertising. We may also use third-party services such as Google AdSense, Google Analytics, Google Tag Manager, Microsoft Clarity, and Userback, each of which may process data under its own policies.'
        },
        {
          title: '5. Retention and user rights',
          body: 'We keep information only for as long as needed for operational or legal reasons. Where applicable, you may request access, correction, or deletion of your personal data.'
        },
        {
          title: '6. Contact',
          body: 'For privacy-related questions, contact us at newgotae@gmail.com.'
        }
      ]
    },
    terms: {
      title: 'Terms of Service | Randomly Pick',
      description: 'Terms of Service for Randomly Pick and its browser-based random tools.',
      heading: 'Terms of Service',
      effective: 'Effective date: March 6, 2026',
      lead: 'These Terms explain the basic conditions for using Randomly Pick and its browser-based random tools.',
      sections: [
        {
          title: '1. Service scope',
          body: 'The site provides free online random-draw tools. Features, screens, and availability may be added, changed, or discontinued when needed.'
        },
        {
          title: '2. Prohibited use',
          bullets: [
            'You must not use the site for unlawful or harmful activity.',
            'You must not attempt to disrupt service stability, security, or availability.',
            'You must not copy, scrape, or redistribute the site in ways that violate laws or rights.'
          ]
        },
        {
          title: '3. Intellectual property',
          body: 'The site design, brand, code, documentation, and visual assets are owned by Randomly Pick or the relevant rights holders. Commercial reuse without permission is prohibited.'
        },
        {
          title: '4. Disclaimer',
          body: 'The site is provided as is. We do not guarantee uninterrupted operation, error-free service, or fitness for a particular purpose.'
        },
        {
          title: '5. Third-party services and ads',
          body: 'The site may use external analytics, support, and advertising services. Additional terms and policies from those providers may apply.'
        },
        {
          title: '6. Changes and contact',
          body: 'These Terms may be updated when needed. Continued use after an update means you accept the revised Terms. For service questions, contact newgotae@gmail.com.'
        }
      ]
    }
  },
  ja: {
    siteName: 'Randomly Pick',
    homeLabel: 'ホームへ戻る',
    homePath: '/ja/',
    contact: {
      title: 'お問い合わせ | Randomly Pick',
      description: 'Randomly Pick へのお問い合わせページです。サポート、バグ報告、広告・提携の相談を受け付けます。',
      heading: 'お問い合わせ',
      intro: 'サポート、バグ報告、広告・提携に関するご相談は、以下のメールアドレスまでご連絡ください。',
      emailLabel: 'メール',
      detail1: '不具合報告の際は、ページURL、使用言語、端末種類、ブラウザ情報を添えていただくと再現と修正が早くなります。',
      detail2: '広告や提携のご相談では、目的、希望掲載位置、期間をご記載ください。'
    },
    privacy: {
      title: 'プライバシーポリシー | Randomly Pick',
      description: 'Randomly Pick のプライバシーポリシーです。ルーレットや抽選ツール利用時に処理される情報を説明します。',
      heading: 'プライバシーポリシー',
      effective: '施行日: 2026年3月6日',
      lead: 'Randomly Pick は、ルーレット、番号抽選、あみだくじ、コイントス、サイコロなど、ブラウザベースの抽選ツールを提供します。このページでは、サイト利用時に処理される情報について説明します。',
      sections: [
        {
          title: '1. 処理される可能性のある情報',
          bullets: [
            '訪問日時、ブラウザ種別、端末情報、IPアドレスなどの基本的なアクセス情報が収集される場合があります。',
            'お問い合わせ時には、氏名、メールアドレス、メッセージ内容が処理される場合があります。',
            '参加者リストや抽選結果などの入力値は、通常ユーザーのブラウザ内で処理されます。'
          ]
        },
        {
          title: '2. 情報を利用する目的',
          bullets: [
            'サイトを安定して運営し、エラーを修正するためです。',
            '不正利用を検知し、セキュリティと可用性を維持するためです。',
            'サポート、提携、広告に関する問い合わせへ対応するためです。',
            'アクセス状況や広告パフォーマンスを把握し、サービス改善に役立てるためです。'
          ]
        },
        {
          title: '3. ブラウザ内での処理',
          body: '主要な抽選機能はブラウザ内で動作するよう設計されています。参加者リストや抽選状態は、特定の外部連携が必要な場合を除き、当サイトのサーバーに保存されません。'
        },
        {
          title: '4. Cookie と外部サービス',
          body: 'サイトでは基本機能、アクセス解析、広告配信のために Cookie または類似技術を使用する場合があります。また、Google AdSense、Google Analytics、Google Tag Manager、Microsoft Clarity、Userback などの外部サービスを利用する場合があり、各サービスは独自のポリシーに基づいてデータを処理することがあります。'
        },
        {
          title: '5. 保存期間と利用者の権利',
          body: '運営上または法令上必要な期間に限って情報を保持します。適用される法令がある場合、利用者は自己情報へのアクセス、訂正、削除を求めることができます。'
        },
        {
          title: '6. お問い合わせ',
          body: 'プライバシーに関するご質問は newgotae@gmail.com までご連絡ください。'
        }
      ]
    },
    terms: {
      title: '利用規約 | Randomly Pick',
      description: 'Randomly Pick とそのブラウザベース抽選ツールの利用規約です。',
      heading: '利用規約',
      effective: '施行日: 2026年3月6日',
      lead: 'この規約は、Randomly Pick とそのブラウザベースの抽選ツールを利用する際の基本条件を説明します。',
      sections: [
        {
          title: '1. サービス範囲',
          body: '当サイトは無料のオンライン抽選ツールを提供します。機能や画面、提供方式は必要に応じて追加、変更、終了される場合があります。'
        },
        {
          title: '2. 禁止される利用',
          bullets: [
            '違法または他者に害を与える目的でサイトを利用してはいけません。',
            'サービスの安定性、セキュリティ、可用性を妨げる行為をしてはいけません。',
            '法令や権利を侵害する形でサイトを複製、収集、再配布してはいけません。'
          ]
        },
        {
          title: '3. 知的財産権',
          body: 'サイトのデザイン、ブランド、コード、文書、画像などの権利は Randomly Pick または正当な権利者に帰属します。許可のない商用利用は禁止されています。'
        },
        {
          title: '4. 免責',
          body: 'サイトは現状有姿で提供されます。中断のない動作、無エラー、特定目的への適合性を保証するものではありません。'
        },
        {
          title: '5. 外部サービスと広告',
          body: 'サイトでは外部の解析、サポート、広告サービスを利用する場合があります。これらの提供者の追加規約やポリシーが適用されることがあります。'
        },
        {
          title: '6. 変更とお問い合わせ',
          body: '本規約は必要に応じて更新される場合があります。更新後も利用を継続した場合、改定後の規約に同意したものとみなします。サービスに関するご質問は newgotae@gmail.com までご連絡ください。'
        }
      ]
    }
  },
  'zh-cn': {
    siteName: 'Randomly Pick',
    homeLabel: '返回首页',
    homePath: '/zh-cn/',
    contact: {
      title: '联系我们 | Randomly Pick',
      description: 'Randomly Pick 联系页面，提供支持、错误反馈、广告与合作咨询。',
      heading: '联系我们',
      intro: '如需技术支持、错误反馈、广告投放或合作咨询，请通过以下邮箱联系我们。',
      emailLabel: '邮箱',
      detail1: '提交问题时，请附上页面地址、使用语言、设备类型和浏览器信息，以便我们更快复现问题。',
      detail2: '如需广告或合作咨询，请说明目的、期望展示位置和时间安排。'
    },
    privacy: {
      title: '隐私政策 | Randomly Pick',
      description: 'Randomly Pick 隐私政策，说明转盘、抽签、梯子、抛硬币和骰子工具可能处理的信息。',
      heading: '隐私政策',
      effective: '生效日期：2026年3月6日',
      lead: 'Randomly Pick 提供转盘、号码抽取、梯子抽签、抛硬币、掷骰子等基于浏览器的随机工具。本页面说明在使用网站时可能处理哪些信息。',
      sections: [
        {
          title: '1. 可能处理哪些信息？',
          bullets: [
            '可能收集访问时间、浏览器类型、设备信息、IP 地址等基础访问数据。',
            '当你联系我们时，姓名、邮箱地址和留言内容可能被处理。',
            '参与名单和抽签结果等工具输入通常只在你的浏览器中处理。'
          ]
        },
        {
          title: '2. 为什么会使用这些信息？',
          bullets: [
            '用于稳定运行网站并修复错误。',
            '用于识别滥用行为并维护安全与可用性。',
            '用于回复支持、合作和广告相关咨询。',
            '用于了解访问情况和广告表现，以改进服务。'
          ]
        },
        {
          title: '3. 浏览器本地处理',
          body: '核心随机抽取功能被设计为在浏览器中运行。除非某些第三方集成功能明确需要，否则参与名单和抽签状态不会存储到我们的服务器。'
        },
        {
          title: '4. Cookie 与第三方服务',
          body: '网站可能会为基础功能、统计分析和广告使用 Cookie 或类似技术。我们也可能使用 Google AdSense、Google Analytics、Google Tag Manager、Microsoft Clarity、Userback 等第三方服务，这些服务会按照各自的政策处理数据。'
        },
        {
          title: '5. 保存期限与用户权利',
          body: '我们仅在运营或法律需要的期限内保留信息。在适用法律允许的范围内，你可以请求访问、更正或删除个人数据。'
        },
        {
          title: '6. 联系方式',
          body: '如有隐私相关问题，请发送邮件至 newgotae@gmail.com。'
        }
      ]
    },
    terms: {
      title: '使用条款 | Randomly Pick',
      description: 'Randomly Pick 及其浏览器随机工具的使用条款。',
      heading: '使用条款',
      effective: '生效日期：2026年3月6日',
      lead: '本条款说明使用 Randomly Pick 及其基于浏览器的随机工具时适用的基本条件。',
      sections: [
        {
          title: '1. 服务范围',
          body: '网站提供免费的在线随机抽取工具。功能、界面和提供方式可能根据运营需要新增、调整或停止。'
        },
        {
          title: '2. 禁止行为',
          bullets: [
            '不得将网站用于非法或有害活动。',
            '不得尝试破坏服务稳定性、安全性或可用性。',
            '不得以侵犯法律或权利的方式复制、抓取或再分发网站内容。'
          ]
        },
        {
          title: '3. 知识产权',
          body: '网站的设计、品牌、代码、文档和视觉资源归 Randomly Pick 或相应权利人所有。未经许可不得进行商业性再利用。'
        },
        {
          title: '4. 免责声明',
          body: '网站按现状提供。我们不保证持续不中断运行、绝对无错误或适用于特定目的。'
        },
        {
          title: '5. 第三方服务与广告',
          body: '网站可能使用外部统计、支持与广告服务。相关服务提供方的附加条款和政策可能同时适用。'
        },
        {
          title: '6. 条款更新与联系',
          body: '本条款可能根据需要更新。更新后继续使用即视为接受修订后的条款。如有服务相关问题，请联系 newgotae@gmail.com。'
        }
      ]
    }
  },
  'zh-tw': {
    siteName: 'Randomly Pick',
    homeLabel: '返回首頁',
    homePath: '/zh-tw/',
    contact: {
      title: '聯絡我們 | Randomly Pick',
      description: 'Randomly Pick 聯絡頁面，提供支援、錯誤回報、廣告與合作洽詢。',
      heading: '聯絡我們',
      intro: '若需技術支援、錯誤回報、廣告投放或合作洽詢，請透過以下信箱聯絡我們。',
      emailLabel: '電子郵件',
      detail1: '回報問題時，請附上頁面網址、使用語言、裝置類型與瀏覽器資訊，方便我們更快重現問題。',
      detail2: '若是廣告或合作洽詢，請一併說明目的、希望曝光的位置與時程。'
    },
    privacy: {
      title: '隱私權政策 | Randomly Pick',
      description: 'Randomly Pick 隱私權政策，說明轉盤、抽籤、梯子、擲硬幣與骰子工具可能處理的資訊。',
      heading: '隱私權政策',
      effective: '生效日期：2026年3月6日',
      lead: 'Randomly Pick 提供轉盤、號碼抽取、梯子抽籤、擲硬幣、擲骰子等以瀏覽器為主的隨機工具。本頁面說明使用網站時可能處理哪些資訊。',
      sections: [
        {
          title: '1. 可能處理哪些資訊？',
          bullets: [
            '可能蒐集造訪時間、瀏覽器類型、裝置資訊、IP 位址等基本存取資料。',
            '當你聯絡我們時，姓名、電子郵件地址與留言內容可能被處理。',
            '參與名單與抽籤結果等工具輸入通常只會在你的瀏覽器內處理。'
          ]
        },
        {
          title: '2. 為什麼會使用這些資訊？',
          bullets: [
            '用於穩定營運網站並修正錯誤。',
            '用於偵測濫用行為並維持安全與可用性。',
            '用於回覆支援、合作與廣告相關洽詢。',
            '用於了解流量與廣告表現，進一步改善服務。'
          ]
        },
        {
          title: '3. 瀏覽器本地處理',
          body: '核心隨機抽取功能設計為在瀏覽器中執行。除非某些第三方整合明確需要，否則參與名單與抽籤狀態不會儲存在我們的伺服器。'
        },
        {
          title: '4. Cookie 與第三方服務',
          body: '網站可能會為基本功能、流量分析與廣告使用 Cookie 或類似技術。我們也可能使用 Google AdSense、Google Analytics、Google Tag Manager、Microsoft Clarity、Userback 等第三方服務，這些服務會依照各自政策處理資料。'
        },
        {
          title: '5. 保存期間與使用者權利',
          body: '我們只會在營運或法律需要的期間內保留資訊。在適用法規範圍內，你可以要求存取、更正或刪除個人資料。'
        },
        {
          title: '6. 聯絡方式',
          body: '若有隱私相關問題，請寄信至 newgotae@gmail.com。'
        }
      ]
    },
    terms: {
      title: '使用條款 | Randomly Pick',
      description: 'Randomly Pick 與其瀏覽器隨機工具的使用條款。',
      heading: '使用條款',
      effective: '生效日期：2026年3月6日',
      lead: '本條款說明使用 Randomly Pick 與其瀏覽器隨機工具時適用的基本條件。',
      sections: [
        {
          title: '1. 服務範圍',
          body: '網站提供免費的線上隨機抽取工具。功能、畫面與提供方式可能依營運需求新增、調整或停止。'
        },
        {
          title: '2. 禁止行為',
          bullets: [
            '不得將網站用於非法或有害活動。',
            '不得嘗試破壞服務穩定性、安全性或可用性。',
            '不得以侵害法律或權利的方式複製、擷取或再散布網站內容。'
          ]
        },
        {
          title: '3. 智慧財產權',
          body: '網站的設計、品牌、程式碼、文件與視覺素材屬於 Randomly Pick 或相關權利人。未經許可不得進行商業再利用。'
        },
        {
          title: '4. 免責聲明',
          body: '網站以現況提供。我們不保證服務持續不中斷、完全無錯誤，或適用於特定目的。'
        },
        {
          title: '5. 第三方服務與廣告',
          body: '網站可能使用外部分析、支援與廣告服務。相關服務供應商的附加條款與政策可能同時適用。'
        },
        {
          title: '6. 條款更新與聯絡',
          body: '本條款可能依需要更新。更新後繼續使用即視為接受修訂後的條款。如有服務相關問題，請聯絡 newgotae@gmail.com。'
        }
      ]
    }
  }
};

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function localePath(locale, slug) {
  return locale === 'ko' ? `/${slug}/` : `/${locale}/${slug}/`;
}

function filesystemPath(locale, slug) {
  return locale === 'ko'
    ? path.join(ROOT, slug, 'index.html')
    : path.join(ROOT, locale, slug, 'index.html');
}

function hreflangs(slug, currentLocale) {
  const lines = [];
  for (const locale of LOCALES) {
    lines.push(`  <link rel="alternate" hreflang="${locale}" href="https://randomly-pick.com${localePath(locale, slug)}" />`);
  }
  lines.push(`  <link rel="alternate" hreflang="x-default" href="https://randomly-pick.com${localePath('ko', slug)}" />`);
  return lines.join('\n');
}

function layout(locale, slug, pageTitle, description, bodyContent) {
  const homePath = I18N[locale].homePath;
  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://randomly-pick.com${localePath(locale, slug)}" />
${hreflangs(slug, locale)}
  <link rel="icon" href="/favicon-r.svg" type="image/svg+xml" />
  <style>
    :root {
      --bg: #f8fafc;
      --panel: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #475569;
      --subtle: #64748b;
      --accent: #111827;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Noto Sans KR", "Noto Sans JP", "Noto Sans SC", "Noto Sans TC", Arial, sans-serif; background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%); color: var(--text); }
    main { max-width: 920px; margin: 0 auto; padding: 32px 18px 64px; line-height: 1.75; }
    .panel { background: var(--panel); border: 1px solid var(--border); border-radius: 24px; padding: 28px 24px; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06); }
    .eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: #eef2ff; color: #3730a3; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; }
    h1 { margin: 16px 0 10px; font-size: clamp(30px, 4vw, 40px); line-height: 1.15; }
    h2 { margin-top: 28px; margin-bottom: 8px; font-size: 20px; }
    p, li { color: var(--muted); }
    ul { padding-left: 20px; }
    .meta { color: var(--subtle); font-size: 14px; margin-bottom: 18px; }
    .links { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 12px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; border-radius: 999px; border: 1px solid var(--border); background: #fff; color: var(--text); text-decoration: none; font-weight: 600; }
    .btn:hover { border-color: #94a3b8; }
    a { color: var(--accent); }
  </style>
</head>
<body>
  <main>
    <div class="panel">
      <span class="eyebrow">Randomly Pick</span>
${bodyContent}
      <div class="links">
        <a class="btn" href="${homePath}">${esc(I18N[locale].homeLabel)}</a>
      </div>
    </div>
  </main>
</body>
</html>
`;
}

function renderContact(locale) {
  const t = I18N[locale].contact;
  const body = `      <h1>${esc(t.heading)}</h1>
      <p>${esc(t.intro)}</p>
      <p><strong>${esc(t.emailLabel)}:</strong> <a href="mailto:newgotae@gmail.com">newgotae@gmail.com</a></p>
      <p>${esc(t.detail1)}</p>
      <p>${esc(t.detail2)}</p>`;
  return layout(locale, 'contact', t.title, t.description, body);
}

function renderPrivacy(locale) {
  const t = I18N[locale].privacy;
  const sections = t.sections.map((section) => {
    if (section.bullets) {
      return `      <h2>${esc(section.title)}</h2>\n      <ul>\n${section.bullets.map((item) => `        <li>${esc(item)}</li>`).join('\n')}\n      </ul>`;
    }
    return `      <h2>${esc(section.title)}</h2>\n      <p>${esc(section.body)}</p>`;
  }).join('\n\n');
  const body = `      <h1>${esc(t.heading)}</h1>
      <p class="meta">${esc(t.effective)}</p>
      <p>${esc(t.lead)}</p>

${sections}`;
  return layout(locale, 'privacy', t.title, t.description, body);
}

function renderTerms(locale) {
  const t = I18N[locale].terms;
  const sections = t.sections.map((section) => {
    if (section.bullets) {
      return `      <h2>${esc(section.title)}</h2>\n      <ul>\n${section.bullets.map((item) => `        <li>${esc(item)}</li>`).join('\n')}\n      </ul>`;
    }
    return `      <h2>${esc(section.title)}</h2>\n      <p>${esc(section.body)}</p>`;
  }).join('\n\n');
  const body = `      <h1>${esc(t.heading)}</h1>
      <p class="meta">${esc(t.effective)}</p>
      <p>${esc(t.lead)}</p>

${sections}`;
  return layout(locale, 'terms', t.title, t.description, body);
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

for (const locale of LOCALES) {
  const renderers = {
    contact: renderContact,
    privacy: renderPrivacy,
    terms: renderTerms
  };
  for (const slug of LEGAL_PAGES) {
    const file = filesystemPath(locale, slug);
    ensureDir(file);
    fs.writeFileSync(file, renderers[slug](locale), 'utf8');
  }
}

console.log('generated localized legal pages for:', LOCALES.join(', '));
