import { GoogleGenAI, Type } from "@google/genai";
import { Asset, AssetCategory } from "../types";

const apiKey = process.env.API_KEY || '';

// Helper to initialize AI. 
// Note: In a real production app, we'd handle the missing key more gracefully in the UI.
const getAI = () => new GoogleGenAI({ apiKey });

export const analyzePortfolio = async (assets: Asset[]): Promise<string> => {
  if (!apiKey) return "API Key가 설정되지 않았습니다.";

  const stockAssets = assets.filter(a => a.category === AssetCategory.STOCK || a.category === AssetCategory.CRYPTO);
  
  if (stockAssets.length === 0) return "분석할 투자 자산(주식/코인)이 없습니다.";

  const portfolioSummary = stockAssets.map(a => 
    `- ${a.name} (${a.details || 'N/A'}): ${a.qty}주, 현재가치 ${a.value.toLocaleString()}원, 매수가 ${a.costBasis?.toLocaleString() || 'N/A'}원`
  ).join('\n');

  const prompt = `
    당신은 월스트리트의 최상위 자산 운용가(Wealth Manager)입니다. 
    다음은 내 VIP 고객의 보유 포트폴리오 중 일부입니다.
    
    [보유 자산 목록]
    ${portfolioSummary}

    각 종목에 대해 간략하고 날카로운 분석을 제공하고, 포트폴리오 전체의 리스크와 밸런스에 대해 냉철하게 평가해주세요.
    현재 시장 트렌드(가상의 최신 트렌드라고 가정)에 맞춰 '매수', '보유', '매도' 의견을 제시하세요.
    말투는 매우 전문적이고 정중하며, 데이터에 기반한 신뢰감을 주어야 합니다. 한국어로 답변하세요.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, 
      }
    });
    return response.text || "분석 결과를 생성할 수 없습니다.";
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return "현재 AI 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateWealthAdvice = async (
  netWorth: number, 
  cashFlow: number, 
  assets: Asset[],
  targetAmount: number,
  targetYear: number
): Promise<string> => {
    if (!apiKey) return "API Key가 설정되지 않았습니다.";

    const assetBreakdown = assets.map(a => `${a.category}: ${a.value}`).join(', ');

    const prompt = `
      고객 재무 상태:
      - 순자산: ${netWorth.toLocaleString()}원
      - 연간 잉여 현금흐름: ${cashFlow.toLocaleString()}원
      - 자산 구성: ${assetBreakdown}
      - 목표: ${targetYear}년까지 ${targetAmount.toLocaleString()}원 달성

      위 데이터를 바탕으로 목표 달성 가능성을 시뮬레이션하고, 자산 배분 조정 전략을 제안하세요.
      부동산, 주식, 채권, 대체 투자(금, 코인) 등의 비중 조절을 구체적인 수치와 함께 제안하십시오.
      월스트리트 프라이빗 뱅커 톤으로 작성하세요.
    `;

    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "조언을 생성할 수 없습니다.";
    } catch (error) {
      console.error("AI Advice Failed:", error);
      return "AI 연결 중 오류가 발생했습니다.";
    }
};
