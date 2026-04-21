import React from 'react';
import { useProject } from '../../context/ProjectContext';

const ContactBlock = ({ id, props, editMode }) => {
  const { updateBlockProps, selectedBlockId, setSelectedBlockId } = useProject();
  const isSelected = selectedBlockId === id;

  const handleBlur = (key, e) => {
    updateBlockProps(id, { [key]: e.target.innerText });
  };

  return (
    <section 
      onClick={() => editMode && setSelectedBlockId(id)}
      className={`py-20 px-8 transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[#5b76fe] ring-inset' : ''}`}
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h2 
            contentEditable={editMode}
            onBlur={(e) => handleBlur('title', e)}
            className="text-4xl font-black mb-6 outline-none"
            style={{ color: 'var(--text-color)' }}
            suppressContentEditableWarning
          >
            {props.title || 'Get in touch with us'}
          </h2>
          <p 
            contentEditable={editMode}
            onBlur={(e) => handleBlur('subtitle', e)}
            className="text-xl opacity-70 mb-10 outline-none"
            style={{ color: 'var(--text-color)' }}
            suppressContentEditableWarning
          >
            {props.subtitle || 'Have a question or want to work together? Drop us a message.'}
          </p>
          <div className="space-y-4 opacity-50 font-bold">
            <p>hello@chameleon.build</p>
            <p>+1 (555) 000-0000</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#c7cad5] shadow-lg">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Name</label>
              <input 
                type="text" 
                placeholder="Your name"
                className="w-full p-4 bg-[#f8f9fb] border border-[#e9eaef] rounded-xl outline-none focus:ring-2 focus:ring-[#5b76fe] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Email</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full p-4 bg-[#f8f9fb] border border-[#e9eaef] rounded-xl outline-none focus:ring-2 focus:ring-[#5b76fe] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Message</label>
              <textarea 
                rows="4"
                placeholder="How can we help?"
                className="w-full p-4 bg-[#f8f9fb] border border-[#e9eaef] rounded-xl outline-none focus:ring-2 focus:ring-[#5b76fe] transition-all resize-none"
              ></textarea>
            </div>
            <button 
              className="w-full py-4 text-white font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              style={{ backgroundColor: 'var(--primary-color)', borderRadius: 'var(--border-radius)' }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactBlock;
