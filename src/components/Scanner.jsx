import React, { useState } from 'react';
import { Upload, MessageSquare, Link2, Search, Image as ImageIcon, X, Settings, Info, Eye, EyeOff, FileText, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { isValidGeminiApiKey, testGeminiApiKey } from '../services/gemini';

export default function Scanner({ onAnalyze, isLoading, apiKey, setApiKey }) {
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'text' | 'url'
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showKeyPassword, setShowKeyPassword] = useState(false);
  const [saveSessionKey, setSaveSessionKey] = useState(true);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const hasApiKey = Boolean(apiKey && apiKey.trim());
  const isApiKeyValid = hasApiKey && isValidGeminiApiKey(apiKey);

  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);
    const res = await testGeminiApiKey(apiKey);
    setTestResult(res);
    setIsTestingKey(false);
  };

  // File Size Helper
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5MB.");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const clearTextMessage = () => {
    setTextInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'image') {
      if (!imagePreview) {
        alert("Please upload a screenshot first.");
        return;
      }
      onAnalyze({ base64: imagePreview, mimeType: selectedImage?.type || 'image/png' }, 'image');
    } else if (activeTab === 'text') {
      if (!textInput.trim()) {
        alert("Please paste the message text.");
        return;
      }
      onAnalyze(textInput.trim(), 'text');
    } else if (activeTab === 'url') {
      if (!urlInput.trim()) {
        alert("Please paste the link URL.");
        return;
      }
      onAnalyze(urlInput.trim(), 'url');
    }
  };

  return (
    <div id="scanner-section" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 my-4 transition-colors duration-200">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Threat Scanner</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Submit suspicious content and receive an explainable security assessment.
            </p>
          </div>
        </div>

        {/* Compact AI Provider Drawer Toggle */}
        <button
          type="button"
          onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors w-full sm:w-auto cursor-pointer ${
            !hasApiKey
              ? showSettingsDrawer
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              : isApiKeyValid
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold'
              : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 font-semibold'
          }`}
        >
          <Settings className="w-3.5 h-3.5 shrink-0" />
          <span>
            {!hasApiKey
              ? 'AI Provider Settings'
              : isApiKeyValid
              ? 'AI Key Active ✓'
              : 'Invalid Key Format ⚠️'}
          </span>
        </button>
      </div>

      {/* Collapsible AI Provider Settings Drawer */}
      {showSettingsDrawer && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Optional AI Provider Configuration</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">Use custom Gemini API key for cloud reasoning</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            <div className="sm:col-span-8 relative">
              <input
                type={showKeyPassword ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API key (e.g. AIzaSy...)"
                className={`w-full bg-white dark:bg-slate-950 border rounded-lg py-2 px-3 pr-8 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none font-sans ${
                  hasApiKey && !isApiKeyValid
                    ? 'border-red-400 dark:border-red-700 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKeyPassword(!showKeyPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showKeyPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="sm:col-span-4 flex items-center justify-between sm:justify-start gap-2.5 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveSessionKey}
                  onChange={(e) => setSaveSessionKey(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span>Store session</span>
              </label>

              {hasApiKey && isApiKeyValid && (
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTestingKey}
                  className="text-xs px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isTestingKey ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <span>Test Connection</span>
                  )}
                </button>
              )}

              {apiKey && (
                <button
                  type="button"
                  onClick={() => { setApiKey(''); setTestResult(null); }}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>

          {testResult && (
            <div className={`text-[10px] sm:text-[11px] p-2.5 rounded border flex items-center gap-2 font-semibold ${
              testResult.success
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {hasApiKey && !testResult && (
            isApiKeyValid ? (
              <div className="text-[10px] sm:text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/50 p-2 rounded border border-emerald-200 dark:border-emerald-900 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Valid Gemini API key format detected. Click "Test Connection" to ping Google servers!</span>
              </div>
            ) : (
              <div className="text-[10px] sm:text-[11px] text-red-700 dark:text-red-300 bg-red-50/70 dark:bg-red-950/50 p-2 rounded border border-red-200 dark:border-red-900 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Invalid key format. Google AI Studio keys start with "AIza" or "AQ." (35–65 characters). Using local rule engine.</span>
              </div>
            )
          )}

          <div className="text-[10px] sm:text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/50 p-2 rounded border border-blue-100 dark:border-blue-900 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Your key is stored locally in browser memory and never saved on external logs.</span>
          </div>
        </div>
      )}

      {/* Full-Width Workspace Card */}
      <div className="clean-card rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 sm:gap-6 border-b border-slate-200 dark:border-slate-800 pb-3 mb-5 font-medium text-xs text-center">
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center justify-center gap-1.5 pb-3 -mb-3 border-b-2 transition-colors py-1 cursor-pointer ${
              activeTab === 'image'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">Screenshot</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center justify-center gap-1.5 pb-3 -mb-3 border-b-2 transition-colors py-1 cursor-pointer ${
              activeTab === 'text'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="truncate">Message Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center justify-center gap-1.5 pb-3 -mb-3 border-b-2 transition-colors py-1 cursor-pointer ${
              activeTab === 'url'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Link2 className="w-4 h-4 shrink-0" />
            <span className="truncate">URL Inspector</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          
          {/* TAB 1: SCREENSHOT */}
          {activeTab === 'image' && (
            <div>
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full min-h-[190px] border-2 border-dashed border-blue-200 dark:border-blue-900 hover:border-blue-500 rounded-xl cursor-pointer bg-blue-50/30 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors p-4 sm:p-6 text-center">
                  <Upload className="w-8 h-8 sm:w-9 sm:h-9 text-blue-500 mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Drop a suspicious screenshot here
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 my-1">or</p>
                  <span className="blue-btn px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold shadow-sm">
                    Browse files
                  </span>
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-2 font-mono">
                    Supported: PNG, JPG, JPEG, WEBP
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    
                    {/* File Meta Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate">
                          {selectedImage?.name || "screenshot_uploaded.png"}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Size: {formatFileSize(selectedImage?.size)} • {selectedImage?.type || 'image/png'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="blue-btn flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-lg font-semibold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5" />
                            <span>Analyze Screenshot</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* Image Preview Window */}
                  <div className="flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-72 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Full Screenshot Preview"
                      className="max-h-60 object-contain rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MESSAGE TEXT */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
                placeholder="Paste suspicious SMS, WhatsApp message, email or internship offer..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
              />
              
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
                <span>{textInput.length} characters</span>
                
                <div className="flex items-center justify-between xs:justify-end gap-3">
                  {textInput.length > 0 && (
                    <button
                      type="button"
                      onClick={clearTextMessage}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline transition-colors"
                    >
                      Clear text
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="blue-btn px-5 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-2 w-full xs:w-auto cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing Message...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Analyze Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: URL INSPECTOR */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter suspicious URL (e.g. http://amzn-security-login.xyz)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="blue-btn w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Inspecting Link...</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Inspect Link</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Inspect domain structure, redirects and impersonation signals.
              </p>
            </div>
          )}

        </form>

      </div>

    </div>
  );
}
