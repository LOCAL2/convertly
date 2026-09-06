import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LengthConverter from './pages/UnitConverters/LengthConverter';

// Phase 2 Tools
import DecimalBinary from './pages/NumberTools/DecimalBinary';
import UnixTimestamp from './pages/TimeTools/UnixTimestamp';
import JsonFormatter from './pages/DeveloperTools/JsonFormatter';
import JsonToCsv from './pages/DeveloperTools/JsonToCsv';
import CssFormatter from './pages/DeveloperTools/CssFormatter';
import SqlFormatter from './pages/DeveloperTools/SqlFormatter';
import GitCheatSheet from './pages/DeveloperTools/GitCheatSheet';
import ApiTester from './pages/DeveloperTools/ApiTester';
import HexRgb from './pages/ColorTools/HexRgb';
import WordCounter from './pages/TextTools/WordCounter';
import Base64Encode from './pages/ImageTools/Base64Encode';
import SvgOptimizer from './pages/ImageTools/SvgOptimizer';
import QrGenerator from './pages/ImageTools/QrGenerator';
import ImageCompressor from './pages/ImageTools/ImageCompressor';
import FaviconGenerator from './pages/ImageTools/FaviconGenerator';
import SocialMediaResizer from './pages/ImageTools/SocialMediaResizer';
import MultiFormatConverter from './pages/ImageTools/MultiFormatConverter';
import AsciiArtGenerator from './pages/ImageTools/AsciiArtGenerator';
import UrlParser from './pages/NetworkTools/UrlParser';
import DiscountCalc from './pages/FinanceTools/DiscountCalc';
import PercentageCalc from './pages/Calculators/PercentageCalc';
import TextBase64 from './pages/Encoders/TextBase64';
import TextBase32 from './pages/Encoders/TextBase32';
import UrlEncode from './pages/Encoders/UrlEncode';
import HtmlEntity from './pages/Encoders/HtmlEntity';
import JwtDecoder from './pages/Encoders/JwtDecoder';
import HashGenerator from './pages/Encoders/HashGenerator';
import PasswordGenerator from './pages/Encoders/PasswordGenerator';
import BcryptGenerator from './pages/Encoders/BcryptGenerator';
import RsaGenerator from './pages/Encoders/RsaGenerator';
import AesEncrypt from './pages/Encoders/AesEncrypt';

import WeightConverter from './pages/UnitConverters/WeightConverter';
import TemperatureConverter from './pages/UnitConverters/TemperatureConverter';
import RomanNumerals from './pages/NumberTools/RomanNumerals';
import DateDifference from './pages/TimeTools/DateDifference';
import UuidGenerator from './pages/DeveloperTools/UuidGenerator';
import RgbHsl from './pages/ColorTools/RgbHsl';
import GradientGenerator from './pages/ColorTools/GradientGenerator';
import ContrastChecker from './pages/ColorTools/ContrastChecker';
import ShadowGenerator from './pages/DeveloperTools/ShadowGenerator';
import CaseConverter from './pages/TextTools/CaseConverter';
import TextDiff from './pages/TextTools/TextDiff';
import LoremIpsum from './pages/TextTools/LoremIpsum';
import IpSubnet from './pages/NetworkTools/IpSubnet';
import LoanCalculator from './pages/FinanceTools/LoanCalculator';
import BmiCalculator from './pages/Calculators/BmiCalculator';
import RandomWheel from './pages/Calculators/RandomWheel';

import SalaryCalculator from './pages/FinanceTools/SalaryCalculator';
import SplitBill from './pages/FinanceTools/SplitBill';
import TimezoneConverter from './pages/TimeTools/TimezoneConverter';
import PomodoroTimer from './pages/TimeTools/PomodoroTimer';

import UserAgentParser from './pages/NetworkTools/UserAgentParser';
import DnsLookup from './pages/NetworkTools/DnsLookup';
import SslChecker from './pages/NetworkTools/SslChecker';
import MarkdownEditor from './pages/TextTools/MarkdownEditor';

import JsonToTypes from './pages/DeveloperTools/JsonToTypes';
import CurlConverter from './pages/DeveloperTools/CurlConverter';
import YamlJsonToml from './pages/DeveloperTools/YamlJsonToml';
import CommentRemover from './pages/DeveloperTools/CommentRemover';

import GlassmorphismGenerator from './pages/ColorTools/GlassmorphismGenerator';
import PaletteGenerator from './pages/ColorTools/PaletteGenerator';
import AspectRatioCalc from './pages/ColorTools/AspectRatioCalc';
import FontPairPreviewer from './pages/ColorTools/FontPairPreviewer';

import CidrCalculator from './pages/NetworkTools/CidrCalculator';
import HeaderAnalyzer from './pages/NetworkTools/HeaderAnalyzer';
import NginxHtaccessGen from './pages/NetworkTools/NginxHtaccessGen';
import PasswordAnalyzer from './pages/Encoders/PasswordAnalyzer';

import ImageCropper from './pages/ImageTools/ImageCropper';
import ExifViewer from './pages/ImageTools/ExifViewer';
import SvgEditor from './pages/ImageTools/SvgEditor';

import CompoundInterest from './pages/FinanceTools/CompoundInterest';
import DownloadCalculator from './pages/UnitConverters/DownloadCalculator';
import WorkingDays from './pages/TimeTools/WorkingDays';

import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="convertly-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* Unit Converters */}
            <Route path="unit-converters/length" element={<LengthConverter />} />
            
            {/* Phase 2 Tools */}
            <Route path="number-tools/decimal-binary" element={<DecimalBinary />} />
            <Route path="time-tools/unix-timestamp" element={<UnixTimestamp />} />
            <Route path="developer-tools/json-formatter" element={<JsonFormatter />} />
            <Route path="developer-tools/json-to-csv" element={<JsonToCsv />} />
            <Route path="developer-tools/css-formatter" element={<CssFormatter />} />
            <Route path="developer-tools/sql-formatter" element={<SqlFormatter />} />
            <Route path="developer-tools/git-cheatsheet" element={<GitCheatSheet />} />
            <Route path="color-tools/hex-rgb" element={<HexRgb />} />
            <Route path="text-tools/word-counter" element={<WordCounter />} />
            <Route path="image-tools/base64-encode" element={<Base64Encode />} />
            <Route path="/network-tools/url-parser" element={<UrlParser />} />
            <Route path="/finance-tools/discount-calculator" element={<DiscountCalc />} />
            <Route path="/calculators/percentage" element={<PercentageCalc />} />
            <Route path="/encoders-decoders/text-base64" element={<TextBase64 />} />
            <Route path="/encoders-decoders/text-base32" element={<TextBase32 />} />
            <Route path="/encoders-decoders/url-encode" element={<UrlEncode />} />
            <Route path="/encoders-decoders/html-entity" element={<HtmlEntity />} />
            <Route path="/encoders-decoders/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/encoders-decoders/hash-generator" element={<HashGenerator />} />
            <Route path="/encoders-decoders/password-generator" element={<PasswordGenerator />} />
            <Route path="/encoders-decoders/bcrypt-generator" element={<BcryptGenerator />} />
            <Route path="/encoders-decoders/rsa-generator" element={<RsaGenerator />} />
            <Route path="/encoders-decoders/aes-encrypt" element={<AesEncrypt />} />

            <Route path="/unit-converters/weight" element={<WeightConverter />} />
            <Route path="/unit-converters/temperature" element={<TemperatureConverter />} />
            <Route path="/number-tools/roman-numerals" element={<RomanNumerals />} />
            <Route path="/time-tools/date-difference" element={<DateDifference />} />
            <Route path="/developer-tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/color-tools/rgb-hsl" element={<RgbHsl />} />
            <Route path="/color-tools/gradient-generator" element={<GradientGenerator />} />
            <Route path="/color-tools/contrast-checker" element={<ContrastChecker />} />
            <Route path="/developer-tools/shadow-generator" element={<ShadowGenerator />} />
            <Route path="/image-tools/svg-optimizer" element={<SvgOptimizer />} />
            <Route path="/image-tools/qr-generator" element={<QrGenerator />} />
            <Route path="/image-tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/image-tools/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/text-tools/case-converter" element={<CaseConverter />} />
            <Route path="/text-tools/text-diff" element={<TextDiff />} />
            <Route path="/text-tools/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/network-tools/ip-subnet" element={<IpSubnet />} />
            <Route path="/finance-tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/calculators/bmi" element={<BmiCalculator />} />
            <Route path="/calculators/random-wheel" element={<RandomWheel />} />

            <Route path="/finance-tools/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/finance-tools/split-bill" element={<SplitBill />} />
            <Route path="/time-tools/timezone-converter" element={<TimezoneConverter />} />
            <Route path="/time-tools/pomodoro-timer" element={<PomodoroTimer />} />

            <Route path="/network-tools/user-agent-parser" element={<UserAgentParser />} />
            <Route path="/network-tools/dns-lookup" element={<DnsLookup />} />
            <Route path="/network-tools/ssl-checker" element={<SslChecker />} />
            <Route path="/text-tools/markdown-editor" element={<MarkdownEditor />} />

            <Route path="/developer-tools/json-to-types" element={<JsonToTypes />} />
            <Route path="/developer-tools/curl-converter" element={<CurlConverter />} />
            <Route path="/developer-tools/api-tester" element={<ApiTester />} />
            <Route path="/developer-tools/yaml-json-toml" element={<YamlJsonToml />} />
            <Route path="/developer-tools/comment-remover" element={<CommentRemover />} />

            <Route path="/color-tools/glassmorphism-generator" element={<GlassmorphismGenerator />} />
            <Route path="/color-tools/palette-generator" element={<PaletteGenerator />} />
            <Route path="/color-tools/aspect-ratio-calculator" element={<AspectRatioCalc />} />
            <Route path="/color-tools/font-pair-previewer" element={<FontPairPreviewer />} />

            <Route path="/network-tools/cidr-calculator" element={<CidrCalculator />} />
            <Route path="/network-tools/header-analyzer" element={<HeaderAnalyzer />} />
            <Route path="/network-tools/nginx-htaccess-generator" element={<NginxHtaccessGen />} />
            <Route path="/encoders-decoders/password-analyzer" element={<PasswordAnalyzer />} />

            <Route path="/image-tools/image-cropper" element={<ImageCropper />} />
            <Route path="/image-tools/exif-viewer" element={<ExifViewer />} />
            <Route path="/image-tools/svg-editor" element={<SvgEditor />} />
            <Route path="/image-tools/social-resizer" element={<SocialMediaResizer />} />
            <Route path="/image-tools/format-converter" element={<MultiFormatConverter />} />
            <Route path="/image-tools/ascii-art" element={<AsciiArtGenerator />} />

            <Route path="/finance-tools/compound-interest" element={<CompoundInterest />} />
            <Route path="/unit-converters/download-calculator" element={<DownloadCalculator />} />
            <Route path="/time-tools/working-days" element={<WorkingDays />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
