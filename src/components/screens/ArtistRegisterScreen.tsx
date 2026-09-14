import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, User, MapPin, Building, Palette, Languages, Users, Check } from 'lucide-react';
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
  image: string;
}

const CRAFTS: CraftItem[] = [
  { id: 'Pottery', label: 'मिट्टी के बर्तन / पॉटरी', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&auto=format&fit=crop&q=80' },
  { id: 'Textile', label: 'हथकरघा / ब्लॉक प्रिंट', image: 'https://images.unsplash.com/photo-1606744888344-493238955037?w=200&auto=format&fit=crop&q=80' },
  { id: 'Woodwork', label: 'काष्ठ कला / नक्काशी', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=200&auto=format&fit=crop&q=80' },
  { id: 'Jewelry', label: 'मीनाकारी / धातु आभूषण', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80' },
  { id: 'Painting', label: 'मधुबनी / लोक चित्रकला', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80' },
  { id: 'Other', label: 'अन्य पारंपरिक शिल्प', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&auto=format&fit=crop&q=80' },
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
    <div className="min-h-screen bg-stone-100 p-4 sm:p-5 max-w-xl mx-auto flex flex-col justify-between py-4 select-none">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top Header with Progress indicator (1 of 3 steps) */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold tracking-wider text-stone-700 bg-stone-200/80 px-2.5 py-1 rounded">
              Step 1 of 3 (कदम 1 / 3)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-1.5 rounded-full bg-stone-900"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight">
                {t.registerArtist}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Register artisan profile or helper credentials
              </p>
            </div>
            <AudioSpeakerButton
              text={`${t.registerArtist}। कारीगर का नाम, गाँव और शिल्प का प्रकार दर्ज करें।`}
              language={language}
              size="sm"
              title="शीर्षक सुनें"
              id="artist-register-hear-title-btn"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
          {/* 1. Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-600" />
                <span>Artisan Name (कारीगर का नाम) *</span>
              </label>
              <div className="flex items-center gap-1">
                <AudioSpeakerButton
                  text="कारीगर का नाम दर्ज करें या बोलकर बताएं।"
                  language={language}
                  size="sm"
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
              placeholder="e.g. Ramesh Kumar"
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-medium text-stone-900 focus:border-stone-900 focus:outline-hidden bg-white"
            />
          </div>

          {/* 2. Village */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-stone-600" />
                <span>Village or Town (गाँव / कस्बा) *</span>
              </label>
              <div className="flex items-center gap-1">
                <AudioSpeakerButton
                  text="गाँव या कस्बा दर्ज करें या बोलकर बताएं।"
                  language={language}
                  size="sm"
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
              placeholder="e.g. Bagru"
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-medium text-stone-900 focus:border-stone-900 focus:outline-hidden bg-white"
            />
          </div>

          {/* 3. District */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-600" />
                <span>District / State (ज़िला / राज्य) *</span>
              </label>
              <div className="flex items-center gap-1">
                <AudioSpeakerButton
                  text="ज़िला और राज्य बताएं।"
                  language={language}
                  size="sm"
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
              placeholder="e.g. Jaipur, Rajasthan"
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-medium text-stone-900 focus:border-stone-900 focus:outline-hidden bg-white"
            />
          </div>

          {/* 4. Craft */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-stone-600" />
                <span>Craft Speciality (शिल्प प्रकार) *</span>
              </label>
              <AudioSpeakerButton
                text="शिल्प का प्रकार चुनें।"
                language={language}
                size="sm"
                title="सुनें"
                id="hear-craft-field-btn"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
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
                    className={`p-2 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.label}
                      className="w-9 h-9 rounded object-cover shrink-0 border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">
                        {c.id}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {c.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Language */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-stone-600" />
                <span>Preferred Language (भाषा)</span>
              </label>
              <AudioSpeakerButton
                text="कारीगर की पसंदीदा भाषा चुनें।"
                language={language}
                size="sm"
                title="सुनें"
                id="hear-lang-field-btn"
              />
            </div>
            <select
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value as Language)}
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-xs sm:text-sm font-medium text-stone-900 bg-white focus:border-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          {/* 6. Relationship */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-600" />
                <span>Relationship (कारीगर से रिश्ता)</span>
              </label>
              <AudioSpeakerButton
                text="क्या आप खुद कारीगर हैं या सहायता कर रहे हैं?"
                language={language}
                size="sm"
                title="सुनें"
                id="hear-rel-field-btn"
              />
            </div>
            <div className="space-y-2">
              <label className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                relationship === 'self'
                  ? 'border-stone-900 bg-stone-50'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="relationship"
                  value="self"
                  checked={relationship === 'self'}
                  onChange={() => setRelationship('self')}
                  className="w-4 h-4 text-stone-900 accent-stone-900"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 block">
                    I am this artisan (मैं खुद कारीगर हूँ)
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Direct producer selling personal crafts
                  </span>
                </div>
              </label>

              <label className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                relationship === 'helper'
                  ? 'border-stone-900 bg-stone-50'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <input
                  type="radio"
                  name="relationship"
                  value="helper"
                  checked={relationship === 'helper'}
                  onChange={() => setRelationship('helper')}
                  className="w-4 h-4 text-stone-900 accent-stone-900"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 block">
                    I am assisting the artisan (सहायक / परिवार / मित्र)
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Assisting elderly or non-smartphone artisans
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div>
          <button
            type="submit"
            id="artist-save-continue-btn"
            className="w-full h-11 rounded-lg bg-stone-900 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Save & Continue (सेव करें)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

