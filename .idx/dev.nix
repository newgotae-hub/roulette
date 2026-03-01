{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.python3
  ];
  env = {};
  idx = {
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          # Next.js 개발 서버를 실행하고 IDX가 제공하는 $PORT를 사용합니다.
          command = ["npm", "run", "dev", "--", "-p", "$PORT", "--hostname", "0.0.0.0"];
          manager = "web";
        };
      };
    };
    workspace = {
      onCreate = {
        npm-install = "npm install";
        default.openFiles = [ "src/app/page.tsx" ];
      };
      onStart = {
        # 워크스페이스 시작 시 의존성 체크
        npm-install = "npm install";
      };
    };
  };
}
