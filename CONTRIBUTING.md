# 貢献 - Contributing

🌐 日本語 ・ [English](CONTRIBUTING.en.md)

ブキみくじへの貢献ありがとうございます。

## 目次

- [開発環境](#開発環境)

- [技術スタック](#技術スタック)

- [機能のリクエストとバグ報告](#新機能のリクエストやバグ報告---issues)

- [Pull Request](#pull-request-pr)

- [ライセンス](#ライセンス)

## 開発環境

- OS: Windows 11 26H2 (ビルド 26300.9550)

  - Windows Subsystem for Linux(WSL) 2

    - Ubuntu 24.04.4 LTS

- Editor: Visual Studio Code

- Node.js v24

- bun v1.3.13 (Package Manager)

- Git v2.43.0 via SSH

- Release Please (GitHub Actionsによるリリースの管理)

## 技術スタック

### Dependencies

- React v19

- Vite v8.3.0

- Tailwind CSS v4.3.3

### DevDependencies

- Biome v2.5.14

- TypeScript v6.0.2


## 新機能のリクエストやバグ報告 - Issues

新機能のリクエストをしていただける場合や、バグを報告していただける場合は、 **[Issues](https://github.com/zibasan/spla3-lottery-weapon/issues/new)** を発行してください。

リクエストやバグ報告には以下の情報を書いてください。

### 新機能のリクエスト

```markdown
- どのような機能が欲しいか(具体的に)

- その機能が必要だと考える理由

- 具体的な使用例
```

### バグ報告

```markdown
- 発生した問題

- 再現手順

- 想定される正しい挙動

- 正しい挙動に対してどのような状況になっているか

- 使用しているブラウザ/OS
  - (例)
      OS: Windows 11 26H2 (ビルド 26300.9550)
      ブラウザ: Google Chrome 154

- スクリーンショット/画面録画

- 備考(任意)
```

## Pull Request (PR)

Issuesの代わりに実際のコードを提示していただける場合は、 **[Pull Request](https://github.com/zibasan/spla3-lottery-weapon/pulls)** を送ってください。

PRしていただける際は、リポジトリを **[Fork](https://github.com/zibasan/spla3-lottery-weapon/fork)** して下の手順に従ってください。

### セットアップ手順

1. Forkしたリポジトリを**cloneします**。
```bash
# HTTPSの場合
git clone https://github.com/your-name/your-cloned-repo/
```

2. Forkしたリポジトリのフォルダに**移動**します。
```bash
cd your-cloned-repo
```

3. **依存関係をインストール**します。
> [!IMPORTANT]
> 依存関係をインストールするには、パッケージマネージャーとして **"Bun"** が必要です。
>
> Bunのインストール方法については、必要に応じてご確認ください。

```bash
bun install
```

4. 依存関係が正しくインストールされているか確認する場合は、開発サーバーを起動してください。
> [!IMPORTANT]
> 開発サーバーを起動するには、 **"Node.js v24"** が必要です。
>
> Node.jsのインストール方法については、必要に応じてご確認ください。

```bash
bun run dev
```

5. 行いたい変更を加えます。

### PRを送る手順

1. 変更を加えてbuildします。
```bash
bun run build
```

> [!CAUTION]
> build時にエラーが発生した場合は、エラーを修正してもう一度buildしてください。

2. Biomeによるcheckを実行します。
```bash
bun run check
```

> [!CAUTION]
> check時にエラーが発生した場合は、`--fix`オプションを付けてBiomeに修正してもらうか、エラーを解決してください。
>
> **`--unsafe`オプションを使った修正は行わないでください。**

3. 1と2の手順が完了したら、commitとpushを行ってPRを作成してください。

### PRを送る前に

PRを送る前に、以下のことを確認してください。
- [ ] アプリ(開発サーバー)がエラーなく正常に起動する

- [ ] 追加・変更した機能が正常に動作する

- [ ] 既存の機能が壊れていない

- [ ] Biomeのエラーがない

- [ ] 必要に応じてREADMEなどを更新した

### コーディングについて

- TypeScript / React の既存のコードスタイルに合わせてください。

- 既存のコンポーネントや機能などをできる限り再利用してください。

- 大きな変更を行う場合は、変更を加える前にIssuesで相談してください。


## ライセンス

このリポジトリへの貢献は、[このリポジトリのライセンス](LICENSE)に従います。
