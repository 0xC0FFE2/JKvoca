import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { ArrowLeft, BookOpen, Book, Edit, Trash2, Save, X, Check, Copy, Link, Download, QrCode } from "lucide-react";
import classroomService, { Classroom, Word } from "../services/AdminClassroomService";
import { fetchApiVocabInfo } from "../services/VocabApiService";
import { jsPDF } from "jspdf";
import QRCode from "react-qr-code";

const ClassroomDetail: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "words">("overview");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedClassroom, setEditedClassroom] = useState<Classroom | null>(null);
  const [vocabList, setVocabList] = useState<any[]>([]);
  const [vocabInfo, setVocabInfo] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (classroomId) {
      fetchClassroomInfo();
      fetchVocabList();
    }
  }, [classroomId]);
  
  useEffect(() => {
    if (classroom && classroom.studyingVocabId) {
      fetchVocabInfo(classroom.studyingVocabId);
    }
  }, [classroom]);

  const fetchClassroomInfo = async () => {
    setIsLoading(true);
    try {
      const [classroomData, wordsData] = await Promise.all([
        classroomService.getClassroomById(classroomId as string),
        classroomService.getClassroomWords(classroomId as string)
      ]);
      
      setClassroom(classroomData);
      setEditedClassroom(classroomData);
      setWords(wordsData);
      setError(null);
    } catch (err) {
      setError("클래스룸 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching classroom data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVocabList = async () => {
    try {
      const vocabs = await classroomService.fetchAllVocabs();
      setVocabList(vocabs);
    } catch (err) {
      console.error("단어장 목록을 불러오는데 실패했습니다:", err);
    }
  };
  
  const fetchVocabInfo = async (vocabId: string) => {
    try {
      const info = await fetchApiVocabInfo(vocabId);
      setVocabInfo(info);
    } catch (err) {
      console.error("단어장 정보를 불러오는데 실패했습니다:", err);
      setVocabInfo(null);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedClassroom(classroom);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!editedClassroom) return;

    if (name === "lastVocaId" || name === "testCount") {
      setEditedClassroom({
        ...editedClassroom,
        [name]: parseInt(value)
      });
    } else {
      setEditedClassroom({
        ...editedClassroom,
        [name]: value
      });
    }
    
    if (name === "studyingVocabId" && value) {
      fetchVocabInfo(value);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedClassroom || !classroom) return;
    
    try {
      await classroomService.updateClassroom(classroomId as string, {
        classroomName: editedClassroom.classroomName,
        studyingVocabId: editedClassroom.studyingVocabId,
        lastVocaId: classroom.lastVocaId,
        testCount: editedClassroom.testCount
      });
      
      setClassroom({
        ...classroom,
        classroomName: editedClassroom.classroomName,
        studyingVocabId: editedClassroom.studyingVocabId,
        testCount: editedClassroom.testCount
      });
      setIsEditing(false);
      fetchClassroomInfo();
    } catch (err) {
      setError("반 정보 수정에 실패했습니다.");
      console.error("Error updating classroom:", err);
    }
  };

  const handleDeleteClassroom = async () => {
    try {
      await classroomService.deleteClassroom(classroomId as string);
      navigate("/classroom", { state: { message: "반이 성공적으로 삭제되었습니다." } });
    } catch (err) {
      setError("반 삭제에 실패했습니다.");
      console.error("Error deleting classroom:", err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getExamLink = () => {
    return `https://jkvoca.ncloud.sbs/vocabulary/${classroomId}?ec=true`;
  };
  
  const copyExamLink = () => {
    const examLink = getExamLink();
    navigator.clipboard.writeText(examLink)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  const svgToDataURL = (svg: SVGElement): string => {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    return URL.createObjectURL(svgBlob);
  };

  const exportQRToPDF = async () => {
    if (!classroom) return;
    
    setIsExportingPdf(true);
    
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      const qrCodeUrl = getExamLink();
      const qrSize = 200;
      
      const createSimpleQRCode = () => {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", qrSize.toString());
        svg.setAttribute("height", qrSize.toString());
        svg.setAttribute("viewBox", `0 0 ${qrSize} ${qrSize}`);
        
        const background = document.createElementNS(svgNS, "rect");
        background.setAttribute("width", qrSize.toString());
        background.setAttribute("height", qrSize.toString());
        background.setAttribute("fill", "white");
        svg.appendChild(background);
        
        const border = document.createElementNS(svgNS, "rect");
        border.setAttribute("x", "10");
        border.setAttribute("y", "10");
        border.setAttribute("width", (qrSize - 20).toString());
        border.setAttribute("height", (qrSize - 20).toString());
        border.setAttribute("stroke", "black");
        border.setAttribute("stroke-width", "5");
        border.setAttribute("fill", "none");
        svg.appendChild(border);
        
        const tl1 = document.createElementNS(svgNS, "rect");
        tl1.setAttribute("x", "30");
        tl1.setAttribute("y", "30");
        tl1.setAttribute("width", "40");
        tl1.setAttribute("height", "40");
        tl1.setAttribute("fill", "black");
        svg.appendChild(tl1);
        
        const tl2 = document.createElementNS(svgNS, "rect");
        tl2.setAttribute("x", "40");
        tl2.setAttribute("y", "40");
        tl2.setAttribute("width", "20");
        tl2.setAttribute("height", "20");
        tl2.setAttribute("fill", "white");
        svg.appendChild(tl2);
        
        const tr1 = document.createElementNS(svgNS, "rect");
        tr1.setAttribute("x", (qrSize - 70).toString());
        tr1.setAttribute("y", "30");
        tr1.setAttribute("width", "40");
        tr1.setAttribute("height", "40");
        tr1.setAttribute("fill", "black");
        svg.appendChild(tr1);
        
        const tr2 = document.createElementNS(svgNS, "rect");
        tr2.setAttribute("x", (qrSize - 60).toString());
        tr2.setAttribute("y", "40");
        tr2.setAttribute("width", "20");
        tr2.setAttribute("height", "20");
        tr2.setAttribute("fill", "white");
        svg.appendChild(tr2);
        
        const bl1 = document.createElementNS(svgNS, "rect");
        bl1.setAttribute("x", "30");
        bl1.setAttribute("y", (qrSize - 70).toString());
        bl1.setAttribute("width", "40");
        bl1.setAttribute("height", "40");
        bl1.setAttribute("fill", "black");
        svg.appendChild(bl1);
        
        const bl2 = document.createElementNS(svgNS, "rect");
        bl2.setAttribute("x", "40");
        bl2.setAttribute("y", (qrSize - 60).toString());
        bl2.setAttribute("width", "20");
        bl2.setAttribute("height", "20");
        bl2.setAttribute("fill", "white");
        svg.appendChild(bl2);
        
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", (qrSize / 2).toString());
        text.setAttribute("y", (qrSize / 2).toString());
        text.setAttribute("font-size", "16");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.textContent = "QR 코드 이미지";
        svg.appendChild(text);
        
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if (Math.random() > 0.5) {
              const rect = document.createElementNS(svgNS, "rect");
              rect.setAttribute("x", (90 + i * 15).toString());
              rect.setAttribute("y", (90 + j * 15).toString());
              rect.setAttribute("width", "10");
              rect.setAttribute("height", "10");
              rect.setAttribute("fill", "black");
              svg.appendChild(rect);
            }
          }
        }
        
        return svg;
      };
      
      const qrSvg = createSimpleQRCode();
      tempDiv.appendChild(qrSvg);
      
      const svgUrl = svgToDataURL(qrSvg);
      
      const img = new Image();
      img.src = svgUrl;
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = qrSize;
          canvas.height = qrSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          
          const pngUrl = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          const margin = 20;
          const contentWidth = pdfWidth - (margin * 2);
          
          const imgWidth = 160;
          const imgHeight = 160;
          
          const x = (pdfWidth - imgWidth) / 2;
          const y = 60;
          
          pdf.setFontSize(18);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${classroom.classroomName}`, pdfWidth / 2, 30, { align: 'center' });
          
          pdf.setFontSize(14);
          pdf.text('시험 접속 QR 코드', pdfWidth / 2, 40, { align: 'center' });
          
          const today = new Date();
          const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
          pdf.setFontSize(10);
          pdf.text(`생성일: ${dateStr}`, pdfWidth / 2, 50, { align: 'center' });
          
          pdf.addImage(pngUrl, 'PNG', x, y, imgWidth, imgHeight);
          
          pdf.setFontSize(12);
          pdf.text('URL:', pdfWidth / 2, y + imgHeight + 15, { align: 'center' });
          pdf.text(qrCodeUrl, pdfWidth / 2, y + imgHeight + 25, { align: 'center' });
          
          pdf.setFontSize(10);
          pdf.text('QR 코드를 스캔하여 시험에 접속하세요.', pdfWidth / 2, y + imgHeight + 40, { align: 'center' });
          
          pdf.save(`${classroom.classroomName}_QR코드_${dateStr}.pdf`);
          
          URL.revokeObjectURL(svgUrl);
          document.body.removeChild(tempDiv);
          
          resolve();
        };
        
        img.onerror = () => {
          document.body.removeChild(tempDiv);
          resolve();
        };
      });
      
    } catch (err) {
      console.error('PDF 내보내기 중 오류가 발생했습니다:', err);
      alert('PDF 내보내기에 실패했습니다.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !classroom) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error || "클래스룸 정보를 찾을 수 없습니다."}
          </div>
          <button
            onClick={() => navigate("/classroom")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            반 목록으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/classroom")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          반 목록으로 돌아가기
        </button>

        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#205781] to-[#4F959D] text-transparent bg-clip-text">
            {isEditing ? (
              <input
                type="text"
                name="classroomName"
                value={editedClassroom?.classroomName || ""}
                onChange={handleInputChange}
                className="border-b-2 border-blue-500 bg-transparent focus:outline-none px-2 py-1 text-blue-800"
              />
            ) : (
              classroom.classroomName
            )}
          </h1>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  저장
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} className="mr-2" />
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  편집
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">반 삭제 확인</h3>
              <p className="text-gray-600 mb-6">
                '{classroom.classroomName}' 반을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteClassroom}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <BookOpen size={16} className="mr-2" />
              반 개요
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === "words"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("words")}
            >
              <Book size={16} className="mr-2" />
              단어 목록 ({words.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === "overview" ? (
              <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-700 mb-2">시험 링크</h3>
                  <div className="flex items-center">
                    <div className="flex-1 bg-white border border-gray-300 rounded-l-lg p-3 overflow-x-auto">
                      <div className="flex items-center">
                        <Link size={16} className="text-purple-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 whitespace-nowrap">{getExamLink()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={copyExamLink} 
                      className={`flex items-center justify-center ${linkCopied ? 'bg-green-600' : 'bg-purple-600'} text-white p-3 rounded-r-lg h-full transition-colors`}
                    >
                      {linkCopied ? (
                        <>
                          <Check size={16} className="mr-2" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-2" />
                          복사하기
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-purple-600 mt-2">이 링크를 학생들에게 공유하면 시험에 참여할 수 있습니다.</p>
                  
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={exportQRToPDF}
                      disabled={isExportingPdf}
                      className={`flex items-center justify-center ${
                        isExportingPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                      } text-white px-4 py-2 rounded-lg transition-colors`}
                    >
                      {isExportingPdf ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          QR 코드 PDF 생성 중...
                        </>
                      ) : (
                        <>
                          <QrCode size={16} className="mr-2" />
                          <Download size={16} className="mr-2" />
                          QR 코드 PDF로 내보내기
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">단어장</h3>
                    {isEditing ? (
                      <select
                        name="studyingVocabId"
                        value={editedClassroom?.studyingVocabId || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- 단어장 선택 --</option>
                        {vocabList.map((vocab) => (
                          <option key={vocab.vocabId} value={vocab.vocabId}>
                            {vocab.vocabName} ({vocab.vocabLevel}) - {vocab.wordCount}개 단어
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <p className="text-xl font-semibold text-blue-900 truncate">
                          {vocabInfo?.vocabName || "단어장 정보 로딩중..."}
                        </p>
                        {vocabInfo && (
                          <div className="mt-2 text-sm text-blue-700">
                            <span className="inline-block bg-blue-100 rounded px-2 py-1 mr-2">
                              {vocabInfo.vocabCategory}
                            </span>
                            <span className="inline-block bg-blue-100 rounded px-2 py-1">
                              {vocabInfo.vocabLevel}
                            </span>
                            <p className="mt-2 text-gray-600 text-xs">{vocabInfo.vocabDescription}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {words.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            번호
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            영어
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            한국어
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            발음
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            난이도
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {words.sort((a, b) => a.wordIndex - b.wordIndex).map((word) => (
                          <tr key={word.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {word.wordIndex + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{word.english}</div>
                              <div className="text-sm text-gray-500 mt-1 italic">{word.example}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {word.korean}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {word.pronunciation}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(word.difficulty)}`}>
                                {word.difficulty === "EASY" ? "쉬움" : 
                                 word.difficulty === "MEDIUM" ? "보통" : "어려움"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Book size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">단어가 없습니다</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      이 반에 등록된 단어가 없습니다. 단어장 ID와 학습 단어 수를 확인해 주세요.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClassroomDetail;