import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, User, MapPin, Building, Palette, Languages, Users, UserCheck } from 'lucide-react';
import { Artist, CraftType, Language } from '../../types';
import { getTranslation } from '../../utils/translations';
import { speak, stopSpeech } from '../../utils/speech';
import { AudioSpeakerButton } from '../common/AudioSpeakerButton';
import { VoiceInputButton } from '../common/VoiceInputButton';

interface ArtistRegisterScreenProps {
  language: Language;
  onSaveArtist: (artist: Artist) => void;
  isAudioMuted: boolean;
}

interface CraftItem {
  id: CraftType;
  label: string;
  emoji: string;
  image: string;
}

const CRAFTS: CraftItem[] = [
  { id: 'Pottery', label: 'मिट्टी के बर्तन / पॉटरी', emoji: '🏺', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&auto=format&fit=crop&q=80' },
  { id: 'Textile', label: 'हथकरघा / ब्लॉक प्रिंट', emoji: '🧵', image: 'https://images.unsplash.com/photo-1606744888344-493238955037?w=200&auto=format&fit=crop&q=80' },
  { id: 'Woodwork', label: 'काष्ठ कला / नक्काशी', emoji: '🪵', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=200&auto=format&fit=crop&q=80' },
  { id: 'Jewelry', label: 'मीनाकारी / धातु आभूषण', emoji: '💍', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80' },
  { id: 'Painting', label: 'मधुबनी / लोक चित्रकला', emoji: '🎨', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80' },
  { id: 'Other', label: 'अन्य पारंपरिक शिल्प', emoji: '✨', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&auto=format&fit=crop&q=80' },
];

export const ArtistRegisterScreen: React.FC<ArtistRegisterScreenProps> = ({
  language,
  onSaveArtist,
  isAudioMuted,
}) => {
  const t = getTranslation(language);

  const [name, setName] = useState('Ramesh Kumar');
  const [village, setVillage] = useState('Bagru');
  const [district, setDistrict] = useState('Jaipur');
  const [craft, setCraft] = useState<CraftType>('Pottery');
  const [prefLang, setPrefLang] = useState<Language>(language);
  const [relationship, setRelationship] = useState<'self' | 'helper'>('self');

  useEffect(() => {
    if (!isAudioMuted) {
      const timer = setTimeout(() => {
        speak('कारीगर जोड़ें। नाम और गाँव बताएं।', language);
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeech();
      };
    }
  }, [language, isAudioMuted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newArtist: Artist = {
      id: `artist-${Date.now()}`,
      name: name.trim(),
      village: village.trim() || 'Bagru',
      district: district.trim() || 'Jaipur',
      craft,
      language: prefLang,
      relationship,
      productIds: [],
      createdAt: new Date().toISOString(),
      avatar: relationship === 'self' 
        ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      totalEarned: 0,
      rating: 5.0,
      reviewsCount: 1,
      bio: `Skilled artisan specializing in handmade ${craft}. Preserving heritage craft traditions.`,
    };

    if (!isAudioMuted) {
      speak(`${name}, ${district} से, ${craft} बनाते हैं। सेव हो गया।`, prefLang);
    }

    onSaveArtist(newArtist);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Top Header with Progress indicator */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              कदम 1 / 3 (Step 1 of 3)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-8 h-2 rounded-full bg-[#B4431E]"></span>
              <span className="w-2.5 h-2 rounded-full bg-stone-200"></span>
              <span className="w-2.5 h-2 rounded-full bg-stone-200"></span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#B4431E] shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 leading-tight truncate">
                  {t.registerArtist}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5 sm:mt-1 truncate">
                  पहला कारीगर जोड़ें या अपना विवरण दर्ज करें
                </p>
              </div>
            </div>
            <AudioSpeakerButton
              text={`${t.registerArtist}। कारीगर का नाम, गाँव और शिल्प का प्रकार दर्ज करें।`}
              language={language}
              size="md"
              variant="primary"
              title="शीर्षक सुनें"
              id="artist-register-hear-title-btn"
              className="shrink-0"
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl p-3.5 sm:p-6 border border-stone-200 shadow-xs space-y-5 sm:space-y-6">
          {/* Responsive 2-column grid for primary text inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#B4431E]" />
                  <span>कारीगर का नाम (Name) *</span>
                </label>
                <div className="flex items-center gap-1">
                  <AudioSpeakerButton
                    text="कारीगर का नाम दर्ज करें या बोलकर बताएं।"
                    language={language}
                    size="sm"
                    variant="card"
                    title="सुनें"
                    id="hear-name-field-btn"
                  />
                  <VoiceInputButton
                    language={language}
                    onTranscript={(res) => setName(res)}
                    size="sm"
                    promptText="कारीगर का नाम बोलिए..."
                    id="voice-name-input-btn"
                  />
                </div>
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. रमेश कुमार (e.g. Ramesh Kumar)"
                className="w-full min-h-[48px] h-12 px-3.5 rounded-lg border border-stone-300 text-base font-semibold text-stone-900 focus:border-[#B4431E] focus:outline-hidden bg-stone-50/40"
              />
            </div>

            {/* 2. Village */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#B4431E]" />
                  <span>गाँव या कस्बा (Village) *</span>
                </label>
                <div className="flex items-center gap-1">
                  <AudioSpeakerButton
                    text="गाँव या कस्बा दर्ज करें या बोलकर बताएं।"
                    language={language}
                    size="sm"
                    variant="card"
                    title="सुनें"
                    id="hear-village-field-btn"
                  />
                  <VoiceInputButton
                    language={language}
                    onTranscript={(res) => setVillage(res)}
                    size="sm"
                    promptText="गाँव का नाम बोलिए..."
                    id="voice-village-input-btn"
                  />
                </div>
              </div>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="उदा. बगरू (e.g. Bagru)"
                className="w-full min-h-[48px] h-12 px-3.5 rounded-lg border border-stone-300 text-base font-semibold text-stone-900 focus:border-[#B4431E] focus:outline-hidden bg-stone-50/40"
              />
            </div>

            {/* 3. District */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B4431E]" />
                  <span>ज़िला / राज्य (District) *</span>
                </label>
                <div className="flex items-center gap-1">
                  <AudioSpeakerButton
                    text="ज़िला और राज्य बताएं।"
                    language={language}
                    size="sm"
                    variant="card"
                    title="सुनें"
                    id="hear-district-field-btn"
                  />
                  <VoiceInputButton
                    language={language}
                    onTranscript={(res) => setDistrict(res)}
                    size="sm"
                    promptText="ज़िला और राज्य बोलिए..."
                    id="voice-district-input-btn"
                  />
                </div>
              </div>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="उदा. जयपुर, राजस्थान (e.g. Jaipur)"
                className="w-full min-h-[48px] h-12 px-3.5 rounded-lg border border-stone-300 text-base font-semibold text-stone-900 focus:border-[#B4431E] focus:outline-hidden bg-stone-50/40"
              />
            </div>

            {/* 4. Language */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#B4431E]" />
                  <span>कारीगर की भाषा (Language)</span>
                </label>
                <AudioSpeakerButton
                  text="कारीगर की पसंदीदा भाषा चुनें।"
                  language={language}
                  size="sm"
                  variant="card"
                  title="सुनें"
                  id="hear-lang-field-btn"
                />
              </div>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value as Language)}
                className="w-full min-h-[48px] h-12 px-3.5 rounded-lg border border-stone-300 text-base font-semibold text-stone-900 bg-white focus:border-[#B4431E] focus:outline-hidden cursor-pointer"
              >
                <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                <option value="en">🇮🇳 English</option>
                <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                <option value="te">🇮🇳 తెలుగు (Telugu)</option>
                <option value="bn">🇮🇳 বাংলা (Bengali)</option>
                <option value="mr">🇮🇳 मराठी (Marathi)</option>
                <option value="gu">🇮🇳 ગુજરાતી (Gujarati)</option>
                <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
          </div>

          {/* 5. Craft Type Selection */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#B4431E]" />
                <span>कला / शिल्प का प्रकार (Craft) *</span>
              </label>
              <AudioSpeakerButton
                text="शिल्प का प्रकार चुनें। मिट्टी के बर्तन, हथकरघा, काष्ठ कला या अन्य।"
                language={language}
                size="sm"
                variant="card"
                title="सुनें"
                id="hear-craft-field-btn"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {CRAFTS.map((c) => {
                const isSelected = craft === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCraft(c.id);
                      if (!isAudioMuted) speak(c.label, language);
                    }}
                    className={`min-h-[52px] sm:min-h-[56px] p-2 sm:p-2.5 rounded-xl border-2 text-left flex items-center gap-2 sm:gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#B4431E] bg-orange-50/70 shadow-xs ring-2 ring-[#B4431E]/20'
                        : 'border-stone-200 hover:border-amber-300 bg-stone-50/40'
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.label}
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg object-cover shrink-0 border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {c.emoji} {c.id}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-stone-500 truncate mt-0.5">
                        {c.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Relationship Selection */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B4431E]" />
                <span>कारीगर से रिश्ता (Relationship)</span>
              </label>
              <AudioSpeakerButton
                text="कारीगर से अपना संबंध बताएं। क्या आप खुद कारीगर हैं या किसी कारीगर की मदद कर रहे हैं?"
                language={language}
                size="sm"
                variant="card"
                title="सुनें"
                id="hear-rel-field-btn"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                relationship === 'self'
                  ? 'border-[#B4431E] bg-orange-50/60 shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="relationship"
                  value="self"
                  checked={relationship === 'self'}
                  onChange={() => setRelationship('self')}
                  className="mt-1 w-4 h-4 text-[#B4431E] focus:ring-[#B4431E]"
                />
                <div>
                  <span className="text-sm font-bold text-stone-900 block">
                    मैं खुद यह कारीगर हूँ (I am this artisan)
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5 block">
                    मैं अपने बनाए हस्तशिल्प सीधे बाज़ार में बेचूंगा
                  </span>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                relationship === 'helper'
                  ? 'border-[#B4431E] bg-orange-50/60 shadow-xs'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="relationship"
                  value="helper"
                  checked={relationship === 'helper'}
                  onChange={() => setRelationship('helper')}
                  className="mt-1 w-4 h-4 text-[#B4431E] focus:ring-[#B4431E]"
                />
                <div>
                  <span className="text-sm font-bold text-stone-900 block">
                    मैं कारीगर की मदद कर रहा हूँ (Helper / Mitra)
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5 block">
                    स्मार्टफ़ोन न चलाने वाले गाँव के बुजुर्ग या कारीगर की सहायता
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="artist-save-continue-btn"
            className="w-full min-h-[52px] h-13 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>✓ सेव करें (Save & Continue)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
