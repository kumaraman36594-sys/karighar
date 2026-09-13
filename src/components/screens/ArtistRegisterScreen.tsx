import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, User, MapPin, Building, Palette, Languages, Users } from 'lucide-react';
import { Artist, CraftType, Language } from '../../types';
import { getTranslation } from '../../utils/translations';
import { speak, stopSpeech, LANGUAGE_NAMES } from '../../utils/speech';
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-white to-purple-50/30 p-4 sm:p-6 max-w-xl mx-auto flex flex-col justify-between py-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Header with Progress indicator (1 of 3 steps) */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
              कदम 1 / 3 (Step 1 of 3)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-2 rounded-full bg-indigo-600"></span>
              <span className="w-2 h-2 rounded-full bg-gray-200"></span>
              <span className="w-2 h-2 rounded-full bg-gray-200"></span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3 mt-3 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                📝 {t.registerArtist}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                पहला कारीगर जोड़ें या अपना विवरण दर्ज करें
              </p>
            </div>
            <AudioSpeakerButton
              text={`${t.registerArtist}। कारीगर का नाम, गाँव और शिल्प का प्रकार दर्ज करें।`}
              language={language}
              size="lg"
              variant="primary"
              title="शीर्षक सुनें"
              id="artist-register-hear-title-btn"
            />
          </div>
        </div>

        {/* Form Fields: One field per row with 🔊 and 🎤 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-100 shadow-md shadow-indigo-100/40 space-y-6">
          {/* 1. 👤 नाम (Name) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>कारीगर का नाम (Name) *</span>
              </label>
              <div className="flex items-center gap-1.5">
                <AudioSpeakerButton
                  text="कारीगर का नाम दर्ज करें या माइक बटन दबाकर बोलें।"
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
              className="w-full min-h-[56px] h-14 px-4 rounded-2xl border-2 border-gray-200 text-lg font-bold text-gray-900 focus:border-indigo-600 focus:outline-hidden bg-gray-50/30"
            />
          </div>

          {/* 2. 🏠 गाँव (Village) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <span>गाँव या कस्बा (Village) *</span>
              </label>
              <div className="flex items-center gap-1.5">
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
              className="w-full min-h-[56px] h-14 px-4 rounded-2xl border-2 border-gray-200 text-lg font-bold text-gray-900 focus:border-indigo-600 focus:outline-hidden bg-gray-50/30"
            />
          </div>

          {/* 3. 📍 जिला (District) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>ज़िला / राज्य (District) *</span>
              </label>
              <div className="flex items-center gap-1.5">
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
              className="w-full min-h-[56px] h-14 px-4 rounded-2xl border-2 border-gray-200 text-lg font-bold text-gray-900 focus:border-indigo-600 focus:outline-hidden bg-gray-50/30"
            />
          </div>

          {/* 4. 🎨 कला (Craft) - Visual Cards/Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
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
            <div className="grid grid-cols-2 gap-3">
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
                    className={`min-h-[56px] p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/30'
                        : 'border-gray-200 hover:border-indigo-200 bg-white'
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.label}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-gray-900 truncate">
                        {c.emoji} {c.id}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {c.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 🗣️ भाषा (Language) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Languages className="w-5 h-5 text-indigo-600" />
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
              className="w-full min-h-[56px] h-14 px-4 rounded-2xl border-2 border-gray-200 text-lg font-bold text-gray-900 bg-white focus:border-indigo-600 focus:outline-hidden cursor-pointer"
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

          {/* 6. 👥 रिश्ता (Relationship) */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
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
            <div className="space-y-3">
              <label className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                relationship === 'self'
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="relationship"
                  value="self"
                  checked={relationship === 'self'}
                  onChange={() => setRelationship('self')}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-base font-extrabold text-gray-900 block">
                    मैं खुद यह कारीगर हूँ (I am this artisan)
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5 block">
                    मैं अपने बनाए हस्तशिल्प सीधे बेचूंगा
                  </span>
                </div>
              </label>

              <label className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                relationship === 'helper'
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="relationship"
                  value="helper"
                  checked={relationship === 'helper'}
                  onChange={() => setRelationship('helper')}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-base font-extrabold text-gray-900 block">
                    मैं कारीगर की मदद कर रहा हूँ (Family / NGO / Mitra)
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5 block">
                    स्मार्टफ़ोन न चलाने वाले गाँव के बुजुर्ग या कारीगर की सहायता
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom: "सेव करें" Button (Green, 56px height) */}
        <div className="pt-2">
          <button
            type="submit"
            id="artist-save-continue-btn"
            className="w-full min-h-[56px] h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
          >
            <span>✓ सेव करें (Save & Continue)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
