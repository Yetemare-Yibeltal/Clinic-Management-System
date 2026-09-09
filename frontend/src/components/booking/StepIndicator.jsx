// StepIndicator.jsx — Multi-step booking progress indicator
export default function StepIndicator ({ steps = [], currentStep = 0 }) {
  return (
    <div className='flex items-center justify-center gap-0 mb-8'>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div key={index} className='flex items-center'>
            {/* Step circle */}
            <div className='flex flex-col items-center'>
              <div
                className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300'
                style={
                  isCompleted
                    ? {
                        background: 'linear-gradient(135deg,#059669,#0d9488)',
                        color: '#fff'
                      }
                    : isCurrent
                    ? {
                        background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                        color: '#fff',
                        boxShadow: '0 0 0 4px rgba(37,99,235,0.2)'
                      }
                    : {
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.35)',
                        border: '1px solid rgba(255,255,255,0.12)'
                      }
                }
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <p
                className='text-xs mt-1.5 font-medium whitespace-nowrap'
                style={{
                  color: isCurrent
                    ? '#fff'
                    : isCompleted
                    ? '#34d399'
                    : 'rgba(255,255,255,0.35)'
                }}
              >
                {step}
              </p>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className='w-16 h-0.5 mx-1 mb-5 transition-all duration-300'
                style={{
                  background: isCompleted
                    ? 'rgba(5,150,105,0.5)'
                    : 'rgba(255,255,255,0.08)'
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
